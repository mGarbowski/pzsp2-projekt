from __future__ import annotations
from pydantic import BaseModel
from geopy import distance


class Edge(BaseModel):
    """Network edge model"""

    id: str
    node1Id: str
    node2Id: str
    totalCapacity: str
    provisionedCapacity: float


class Node(BaseModel):
    """Network node model"""

    id: str
    latitude: float
    longitude: float
    neighbors: list[str]

    def location(self) -> tuple[float, float]:
        """Returns tuple (self.latitude, self.longitude)"""
        return self.latitude, self.longitude

    def distance(self, other: Node) -> float:
        """Calculates the distance between two nodes in a straight line in kilometers"""
        return distance.geodesic(self.location(), other.location()).km


class Channel(BaseModel):
    """Represents a channel in the network"""

    id: str
    nodes: list[str]
    edges: list[str]
    frequency: float
    width: float


class Network(BaseModel):
    """Network model"""

    nodes: dict[str, Node]
    edges: dict[str, Edge]
    channels: dict[str, Channel]

    def find_edge_by_node_ids(self, node1_id: str, node2_id: str) -> Edge:
        """Find an edge by node ids"""
        for _, edge in self.edges.items():
            if edge.node1Id == node1_id and edge.node2Id == node2_id:
                return edge
            elif edge.node1Id == node2_id and edge.node2Id == node1_id:
                return edge
        raise ValueError(f"Edge between {node1_id} and {node2_id} not found")

    def channel_capacity_sum(self, ch: Channel) -> float:
        """Calculates the sum of provisioned capacities of edges in a channel.
        The larger the sum, the more bloated the channel is."""
        edges = [self.edges[id] for id in ch.edges]
        return sum([e.provisionedCapacity for e in edges])

    def edge_length(self, e_id: str) -> float:
        """Calculates the length of an edge"""
        edge = self.edges[e_id]
        start, end = self.nodes[edge.node1Id], self.nodes[edge.node2Id]
        return start.distance(end)


class OptimisationRequest(BaseModel):
    """Optimisation request model"""

    network: Network
    source: str
    target: str
    bandwidth: str
    optimizer: str
    distanceWeight: float
    evenLoadWeight: float


class OptimisationResponse(BaseModel):
    """Optimisation response model"""

    type: str
    channel: Channel | None
    message: str | None
