from abc import ABC, abstractmethod
from collections import defaultdict
from typing import Literal

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

    @staticmethod
    def get_slices_occupied_by_channel(ch: Channel) -> list[int]:
        """Get a list of indices of slices occupied by a channel"""
        # Frequencies in GHz multiplied by 10000 to avoid operating on floats extensively
        min_frequency = 191.325
        max_frequency = 196.125
        single_slice_bandwidth = 0.00625
        # you can never be too sure ;D
        assert round((max_frequency - min_frequency) / single_slice_bandwidth) == 768

        # for example: width of 50 = 8 slices -> 0.05 = 8 * 0.00625
        ch_width_normalized = ch.width / 1000

        num_slices_taken = round(ch_width_normalized / single_slice_bandwidth)
        channel_start_frequency = ch.frequency - (ch_width_normalized / 2)
        starting_idx = round(
            (channel_start_frequency - min_frequency) / single_slice_bandwidth
        )
        return list(range(starting_idx, starting_idx + num_slices_taken))

    def edge_slice_occupancy_map(self) -> dict[tuple[str, str, int], Literal[0, 1]]:
        """Create a dictionary (node_1_id, node_2_id, slice_idx): slice_occupancy
        where slice_occupancy is binary (0 - free, 1 - occupied)."""
        # slices are not occupied by default
        rv: dict[tuple[str, str, int], Literal[0, 1]] = defaultdict(lambda: 0)

        for _, ch in self.network.channels.items():
            occupied_slice_indices = self.get_slices_occupied_by_channel(ch)
            edges = [self.network.edges[edge_id] for edge_id in ch.edges]
            for edge in edges:
                for slice_idx in occupied_slice_indices:
                    rv[(edge.node1Id, edge.node2Id, slice_idx)] = 1

        return rv
