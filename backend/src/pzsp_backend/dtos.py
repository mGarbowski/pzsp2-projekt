from pydantic import BaseModel


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
