from __future__ import annotations
from collections import defaultdict
from typing import Literal
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

    def edge_length(self, edge: Edge) -> float:
        """Calculates the length of an edge"""
        start, end = self.nodes[edge.node1Id], self.nodes[edge.node2Id]
        return start.distance(end)

    def edge_slice_occupancy_map(self) -> dict[tuple[str, str, int], Literal[0, 1]]:
        """Create a dictionary (node_1_id, node_2_id, slice_idx): slice_occupancy
        where slice_occupancy is binary (0 - free, 1 - occupied)."""
        # slices are not occupied by default
        rv: dict[tuple[str, str, int], Literal[0, 1]] = defaultdict(lambda: 0)

        for _, ch in self.channels.items():
            occupied_slice_indices = self.get_slices_occupied_by_channel(ch)
            edges = [self.edges[edge_id] for edge_id in ch.edges]
            for edge in edges:
                for slice_idx in occupied_slice_indices:
                    rv[(edge.node1Id, edge.node2Id, slice_idx)] = 1

        return rv

    def get_slices_occupied_by_channel(self, ch: Channel) -> list[int]:
        """Get a list of indices of slices occupied by a channel"""
        # Frequencies in GHz multiplied by 10000 to avoid operating on floats extensively
        min_frequency = 191.325
        max_frequency = 196.125
        single_slice_bandwidth = 0.00625
        # you can never be too sure ;D
        assert round((max_frequency - min_frequency) / single_slice_bandwidth) == 768

        num_slices_taken = round((ch.width / single_slice_bandwidth))
        channel_start_frequency = ch.frequency - (ch.width / 2)
        starting_idx = round(
            (channel_start_frequency - min_frequency) / single_slice_bandwidth
        )
        return list(range(starting_idx, starting_idx + num_slices_taken))


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
