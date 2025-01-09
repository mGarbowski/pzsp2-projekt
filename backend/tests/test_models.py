import pytest

from src.pzsp_backend.models import Channel, Edge, Network, Node


@pytest.fixture(autouse=True)
def test_network():
    # Define nodes
    nodes: dict[str, Node] = {
        "N1": Node(
            id="N1",
            latitude=52.2297,
            longitude=21.0122,
            neighbors=["N2", "N4", "N6", "N9"],
        ),  # Warsaw
        "N2": Node(
            id="N2",
            latitude=50.0647,
            longitude=19.9450,
            neighbors=["N1", "N4", "N5", "N7"],
        ),  # Krakow
        "N3": Node(
            id="N3", latitude=51.1079, longitude=17.0385, neighbors=["N4", "N5"]
        ),  # Wroclaw
        "N4": Node(
            id="N4",
            latitude=51.7592,
            longitude=19.4560,
            neighbors=["N1", "N2", "N3", "N5"],
        ),  # Lodz
        "N5": Node(
            id="N5", latitude=50.2649, longitude=19.0238, neighbors=["N2", "N3", "N4"]
        ),  # Katowice
        "N6": Node(
            id="N6", latitude=53.1325, longitude=23.1688, neighbors=["N1", "N7"]
        ),  # Bialystok
        "N7": Node(
            id="N7", latitude=50.0413, longitude=21.9990, neighbors=["N6"]
        ),  # Rzeszow
        "N8": Node(
            id="N8", latitude=53.4285, longitude=14.5528, neighbors=["N9"]
        ),  # Szczecin
        "N9": Node(
            id="N9", latitude=54.3520, longitude=18.6466, neighbors=["N1", "N8"]
        ),  # Gdansk
    }

    # Define edges
    edges: dict[str, Edge] = {
        "E1": Edge(
            id="E1",
            node1Id="N1",
            node2Id="N2",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E2": Edge(
            id="E2",
            node1Id="N1",
            node2Id="N4",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E3": Edge(
            id="E3",
            node1Id="N1",
            node2Id="N6",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E4": Edge(
            id="E4",
            node1Id="N1",
            node2Id="N9",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E5": Edge(
            id="E5",
            node1Id="N2",
            node2Id="N4",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E6": Edge(
            id="E6",
            node1Id="N2",
            node2Id="N5",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E7": Edge(
            id="E7",
            node1Id="N2",
            node2Id="N7",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E8": Edge(
            id="E8",
            node1Id="N3",
            node2Id="N4",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E9": Edge(
            id="E9",
            node1Id="N3",
            node2Id="N5",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E10": Edge(
            id="E10",
            node1Id="N4",
            node2Id="N5",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E11": Edge(
            id="E11",
            node1Id="N6",
            node2Id="N7",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E12": Edge(
            id="E12",
            node1Id="N8",
            node2Id="N9",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
    }

    # Define channels
    channels: dict[str, Channel] = {
        "C1": Channel(
            id="C1",
            nodes=["N9", "N1", "N4", "N3"],
            edges=["E4", "E2", "E8"],
            frequency=195.45,
            width=50.0,
        ),  # Gdansk-Warsaw-Lodz-Wroclaw
        "C2": Channel(
            id="C2",
            nodes=["N6", "N1", "N4", "N5"],
            edges=["E3", "E2", "E10"],
            frequency=195.3,
            width=75.0,
        ),  # Bialystok-Warsaw-Lodz-Katowice
    }

    # Create the network instance
    demo_network = Network(
        nodes=nodes,
        edges=edges,
        channels=channels,
    )

    yield demo_network


def test_find_edge_by_node_ids(test_network):
    edge = test_network.find_edge_by_node_ids("N1", "N2")
    assert edge.id == "E1"

    edge = test_network.find_edge_by_node_ids("N2", "N1")
    assert edge.id == "E1"

    with pytest.raises(ValueError):
        test_network.find_edge_by_node_ids("N1", "N3")


def test_edge_length(test_network):
    edge = test_network.edges["E1"]
    assert test_network.edge_length(edge) == pytest.approx(252.1621)

    edge = test_network.edges["E12"]
    assert test_network.edge_length(edge) == pytest.approx(288.0656)
