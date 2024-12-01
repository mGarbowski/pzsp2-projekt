from __future__ import annotations
from pydantic import BaseModel


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


class Channel(BaseModel):
    """Represents a channel in the network"""

    edge: Edge
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
