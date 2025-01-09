import pytest


def test_find_edge_by_node_ids(test_network):
    edge = test_network.find_edge_by_node_ids("N1", "N2")
    assert edge.id == "E1"

    edge = test_network.find_edge_by_node_ids("N2", "N1")
    assert edge.id == "E1"

    with pytest.raises(ValueError):
        test_network.find_edge_by_node_ids("N1", "N4")


def test_edge_length(test_network):
    edge = test_network.edges["E1"]
    assert test_network.edge_length(edge) == pytest.approx(252.1621)

    edge = test_network.edges["E3"]
    assert test_network.edge_length(edge) == pytest.approx(191.6176)
