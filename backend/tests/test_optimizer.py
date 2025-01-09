import pytest
from pytest import approx, raises

from src.pzsp_backend.models import OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer
from src.pzsp_backend.optimization.constants import TOTAL_SLICES
from src.pzsp_backend.optimization.dijkstra import DijkstraOptimizer
from src.pzsp_backend.optimization.integer.optimizer import IntegerProgrammingOptimizer


def test_slices_from_freq_and_width():
    test_cases = (
        (112.5, 191.49375, list(range(18, 36))),
        (50, 196.1000, list(range(760, 768))),
    )
    for width, freq, slices in test_cases:
        assert Optimizer.get_slice_indices_from_freq_and_width(width, freq) == slices


def test_frequency_and_width_from_slice_list():
    test_cases = (
        (list(range(18, 36)), 112.5, 191.49375),
        (list(range(760, 768)), 50, 196.1000),
    )
    for slices, width, freq in test_cases:
        assert Optimizer.get_frequency_and_width_from_slice_list(slices) == (
            freq,
            width,
        )


def test_calculate_edge_weight_various_weights(test_network):
    cases = (
        ("E1", 1, 1, 302.16217),
        ("E1", 10, 1, 2571.6217),  # 10 * 252.1621 + 1 * 50
        ("E2", 1, 5, 301.8673),
        ("E2", 1, 3, 301.8673),  # not occupied, weight of occupancy does not matter
        ("E2", 3, 1, 905.6021),  # triple the previous expected weight
    )

    for eid, w1, w2, expected in cases:
        op = IntegerProgrammingOptimizer(test_network, False, w1, w2)
        weight = op.calculate_edge_weight(op.network.edges[eid])
        assert weight == approx(expected)


def test_bandwidth_from_string():
    cases = (
        ("100Gbps", 100),
        ("10Gbps", 10),
        ("400Gbps", 400),
    )
    for s, expected in cases:
        assert Optimizer.bandwidth_from_string(s) == expected


def test_num_slices_from_bandwidth(test_network):
    cases = (("10GB/s", 2), ("100GB/s", 8), ("1000GB/s", 32), ("421GB/s", 8))
    for s, expected in cases:
        op = IntegerProgrammingOptimizer(test_network, False, 1, 1)
        assert op.num_slices_from_bandwidth(s) == expected


def test_dijkstra_find_possible_path(test_network):
    requests = [
        OptimisationRequest(
            network=test_network,
            source="N1",
            target="N4",
            bandwidth="100GB/s",
            optimizer="dijkstra",
            evenLoadWeight=1,
            distanceWeight=1,
        ),
        OptimisationRequest(
            network=test_network,
            source="N4",
            target="N2",
            bandwidth="100GB/s",
            optimizer="dijkstra",
            evenLoadWeight=1,
            distanceWeight=5,
        ),
    ]

    for request in requests:
        op = DijkstraOptimizer(
            test_network, False, request.distanceWeight, request.evenLoadWeight
        )
        # No exception should occur, these are valid paths
        op.find_channel(request)


def test_dijkstra_find_impossible_path(test_network, monkeypatch):
    monkeypatch.setattr(
        "src.pzsp_backend.optimization.base.Optimizer.num_slices_from_bandwidth",
        lambda *_: 769,  # Too large to fit into any edge
    )
    request = OptimisationRequest(
        network=test_network,
        source="N4",
        target="N2",
        bandwidth="100GB/s",
        optimizer="dijkstra",
        evenLoadWeight=1,
        distanceWeight=5,
    )

    op = DijkstraOptimizer(
        test_network, False, request.distanceWeight, request.evenLoadWeight
    )

    with raises(Exception):
        op.find_channel(request)


def test_dijkstra_reconstruct_channel(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = ["N1", "N2", "N4"]
    first_slice = 0
    n_slices = 2
    channel = op.reconstruct_channel(path, first_slice, n_slices)

    assert channel.nodes == path
    assert channel.frequency == approx(191.33125)
    assert channel.width == approx(12.5)


def test_dijkstra_reconstruct_nonexisting_channel(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = ["N1", "N4"]
    first_slice = 0
    n_slices = 2
    with raises(ValueError):
        op.reconstruct_channel(path, first_slice, n_slices)


def test_dijkstra_slice_occupancy_map(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    occupancy = op.make_slice_occupancy_map()

    assert len(occupancy) == 4
    assert sum(occupancy["E1"]) == 8
    assert sum(occupancy["E2"]) == 0
    assert sum(occupancy["E3"]) == 8
    assert sum(occupancy["E4"]) == 0


def test_dijkstra_verify_path_fits(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = ["N1", "N2", "N4"]
    n_slices = 20
    first_slice = op.verify_path(path, n_slices)
    assert first_slice == 16  # first 8 are free, 8-15 are taken


def test_dijkstra_verify_path_doesnt_fit(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = ["N1", "N2", "N4"]
    n_slices = 760
    first_slice = op.verify_path(path, n_slices)
    assert first_slice is None


def dijkstra_algorithm_test(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = op.dijkstra("N1", "N4")
    assert path == ["N1", "N2", "N4"]  # shorter than N1->N3->N4


def test_dijkstra_edges_from_node_ids(test_network):
    op = DijkstraOptimizer(test_network, False, 1, 1)
    path = ["N1", "N2", "N4"]
    edges = op.edges_from_node_ids(path)

    assert [e.id for e in edges] == ["E1", "E3"]


@pytest.mark.slow
def test_integer_find_possible_path(test_network):
    requests = [
        OptimisationRequest(
            network=test_network,
            source="N1",
            target="N4",
            bandwidth="100GB/s",
            optimizer="dijkstra",
            evenLoadWeight=1,
            distanceWeight=1,
        ),
        OptimisationRequest(
            network=test_network,
            source="N4",
            target="N2",
            bandwidth="100GB/s",
            optimizer="dijkstra",
            evenLoadWeight=1,
            distanceWeight=5,
        ),
    ]

    for request in requests:
        op = IntegerProgrammingOptimizer(
            test_network, False, request.distanceWeight, request.evenLoadWeight
        )
        # No exception should occur, these are valid paths
        op.find_channel(request)


@pytest.mark.slow
def test_integer_find_impossible_path(test_network, monkeypatch):
    monkeypatch.setattr(
        "src.pzsp_backend.optimization.base.Optimizer.num_slices_from_bandwidth",
        lambda *_: 769,  # Too large to fit into any edge
    )
    request = OptimisationRequest(
        network=test_network,
        source="N4",
        target="N2",
        bandwidth="100GB/s",
        optimizer="dijkstra",
        evenLoadWeight=1,
        distanceWeight=5,
    )

    op = IntegerProgrammingOptimizer(
        test_network, False, request.distanceWeight, request.evenLoadWeight
    )

    with raises(Exception):
        op.find_channel(request)


def test_integer_edge_slice_occupancy_map(test_network):
    op = IntegerProgrammingOptimizer(test_network, False, 1, 1)
    occupancy = op.edge_slice_occupancy_map()

    assert len(occupancy) == 2 * 4 * TOTAL_SLICES  # 2 directions * 4 edges * num slices
    e1_occupancy_sum = sum(occupancy[("N1", "N2", i)] for i in range(TOTAL_SLICES))
    assert e1_occupancy_sum == 8
    e2_occupancy_sum = sum(occupancy[("N1", "N3", i)] for i in range(TOTAL_SLICES))
    assert e2_occupancy_sum == 0
    e3_occupancy_sum = sum(occupancy[("N2", "N4", i)] for i in range(TOTAL_SLICES))
    assert e3_occupancy_sum == 8
    e4_occupancy_sum = sum(occupancy[("N3", "N4", i)] for i in range(TOTAL_SLICES))
    assert e4_occupancy_sum == 0
