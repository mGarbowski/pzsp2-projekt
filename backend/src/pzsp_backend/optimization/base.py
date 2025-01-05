from abc import ABC, abstractmethod

from attrs import define

from src.pzsp_backend.models import Channel, ChannelDescription, Edge, Network


@define
class Optimizer(ABC):
    """Base optimizer backend. Deriving optimizers provide optimization
    details."""

    network: Network
    debug: bool

    @abstractmethod
    def find_channel(self, description: ChannelDescription) -> Channel:
        """Find a channel that satisfies the desscription in an
        optimaly way for the given network."""

    @abstractmethod
    def calculate_edge_weight(self, e: Edge):
        """Calculates the weights of an edge based on the optimizer's params"""
