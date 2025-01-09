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
            neighbors=["N2", "N3"],
        ),  # Warsaw
        "N2": Node(
            id="N2",
            latitude=50.0647,
            longitude=19.9450,
            neighbors=["N1", "N4"],
        ),  # Krakow
        "N3": Node(
            id="N3", latitude=51.1079, longitude=17.0385, neighbors=["N4", "N1"]
        ),  # Wroclaw
        "N4": Node(
            id="N4",
            latitude=51.7592,
            longitude=19.4560,
            neighbors=["N2", "N3"],
        ),  # Lodz
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
            node2Id="N3",
            totalCapacity="100Gbps",
            provisionedCapacity=0,
        ),
        "E3": Edge(
            id="E3",
            node1Id="N2",
            node2Id="N4",
            totalCapacity="100Gbps",
            provisionedCapacity=50,
        ),
        "E4": Edge(
            id="E4",
            node1Id="N3",
            node2Id="N4",
            totalCapacity="100Gbps",
            provisionedCapacity=0,
        ),
    }

    # Define channels
    channels: dict[str, Channel] = {
        "C1": Channel(
            id="C1",
            nodes=["N1", "N2", "N4"],
            edges=["E1", "E3"],
            frequency=191.4000,
            width=50,
        ),  # Warsaw -> Krakow -> Lodz
    }

    # Create the network instance
    demo_network = Network(
        nodes=nodes,
        edges=edges,
        channels=channels,
    )

    yield demo_network
