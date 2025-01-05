from abc import ABC, abstractmethod

from attrs import define

from src.pzsp_backend.models import Channel, Edge, Network, OptimisationRequest


@define
class Optimizer(ABC):
    """Base optimizer backend. Deriving optimizers provide optimization
    details."""

    network: Network
    debug: bool

    @abstractmethod
    def find_channel(self, request: OptimisationRequest) -> Channel:
        """Find a channel that satisfies the desscription in an
        optimaly way for the given network."""

    @abstractmethod
    def calculate_edge_weight(self, e: Edge) -> float:
        """Calculate the weights of an edge based on the optimizer's params"""

    @staticmethod
    def bandwidth_from_string(s: str) -> int:
        """Remove the unit from the bandwidth string and parses it as an int"""
        return int(s[:-4])

    def num_slices_from_bandwidth(self, bandwidth: str) -> int:
        """Calculate the minimum number of slices needed to accomodate a given bandwidth"""
        # TODO: more realistic mapping needed here
        mapping = {10: 1, 40: 4, 100: 10, 400: 40}
        bw_as_int = self.bandwidth_from_string(bandwidth)
        return mapping.get(bw_as_int, 20)  # should actually calculate stuff here
