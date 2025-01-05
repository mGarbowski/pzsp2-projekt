from __future__ import annotations

from pydantic import BaseModel
from pyomo.opt import SolverResults


class Edge(BaseModel):
    """Network edge model"""

    id: str
    node1_id: str
    node2_id: str
    total_capacity: str
    provisioned_capacity: float


class Neighbor(BaseModel):
    """Node neighbor model"""

    node: Node
    edge: Edge


class Node(BaseModel):
    """Network node model"""

    id: str
    latitude: float
    longitude: float
    neighbors: list[Neighbor]


class Network(BaseModel):
    """Network model"""

    nodes: list[Node]
    edges: list[Edge]

    def find_edge_by_node_ids(self, node1_id: str, node2_id: str) -> Edge:
        """Find an edge by node ids"""
        for edge in self.edges:
            if edge.node1_id == node1_id and edge.node2_id == node2_id:
                return edge
            elif edge.node1_id == node2_id and edge.node2_id == node1_id:
                return edge
        raise ValueError(f"Edge between {node1_id} and {node2_id} not found")


class Channel(BaseModel):
    """Represents a channel in the network"""

    edges: list[Edge]
    slice_range: SliceRange


class Slice(BaseModel):
    """Represents a slice in the network"""

    start: float
    end: float


class SliceRange(BaseModel):
    """Represents a slice range in the network"""

    slices: list[Slice]


class ChannelDescription(BaseModel):
    """Represents a description of a channel that gets
    passed to the optimizer"""

    start: Node
    end: Node
    throughput: float
