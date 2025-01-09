from pytest import approx
from src.pzsp_backend.optimization.integer.optimizer import IntegerProgrammingOptimizer
from src.pzsp_backend.optimization.base import Optimizer
from tests.util import test_network


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
    cases = (
        ("100Gbps", 10),
        ("10Gbps", 1),
        ("400Gbps", 40),
        ("40Gbps", 4),
        ("50Gbps", 20),
    )
    for s, expected in cases:
        op = IntegerProgrammingOptimizer(test_network, False, 1, 1)
        assert op.num_slices_from_bandwidth(s) == expected
