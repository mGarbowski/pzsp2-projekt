from abc import ABC, abstractmethod
from attrs import define

from src.pzsp_backend.models import Network, Channel, ChannelDescription


@define
class Optimizer(ABC):
    """Base optimizer backend. Deriving optimizers provide optimization
    details."""

    network: Network

    @abstractmethod
    def find_channel(self, description: ChannelDescription) -> Channel:
        """Find a channel that satisfies the desscription in an
        optimaly way for the given network."""
