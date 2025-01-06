import uuid
from abc import ABC, abstractmethod

from attrs import define

from src.pzsp_backend.models import Channel, Edge, Network, OptimisationRequest
from src.pzsp_backend.optimization.constants import (
    MAX_FREQUENCY,
    MIN_FREQUENCY,
    SINGLE_SLICE_BANDWIDTH,
    WIDTH_NORMALIZATION_FACTOR,
)


@define
class Optimizer(ABC):
    """Base optimizer backend. Deriving optimizers provide optimization
    details."""

    network: Network
    debug: bool
    # The weights we've discussed so far. Probably should add up to 1,
    # etc, but this is just a rough outline of how it's going to look like.
    # We might take in different params at the end of the day after all.
    distance_weight: float
    even_load_weight: float

    @abstractmethod
    def find_channel(self, request: OptimisationRequest) -> Channel:
        """Find a channel that satisfies the desscription in an
        optimaly way for the given network."""

    def calculate_edge_weight(self, e: Edge) -> float:
        """Calculates the weights of an edge based on the optimizer's params"""
        return (
            self.distance_weight * self.network.edge_length(e)
            + self.even_load_weight * e.provisionedCapacity
        )

    @staticmethod
    def bandwidth_from_string(s: str) -> int:
        """Remove the unit from the bandwidth string and parses it as an int"""
        return int(s[:-4])

    def num_slices_from_bandwidth(self, bandwidth: str) -> int:
        """Calculate the minimum number of slices needed for given bandwidth"""
        # TODO: more realistic mapping needed here
        mapping = {10: 1, 40: 4, 100: 10, 400: 40}
        bw_as_int = self.bandwidth_from_string(bandwidth)
        return mapping.get(bw_as_int, 20)  # should actually calculate stuff here

    @staticmethod
    def get_slice_indices_from_freq_and_width(width: float, freq: float) -> list[int]:
        """Get a list of indices of slices occupied by a channel"""
        # you can never be too sure ;D
        assert round((MAX_FREQUENCY - MIN_FREQUENCY) / SINGLE_SLICE_BANDWIDTH) == 768

        # for example: width of 50 = 8 slices -> 0.05 = 8 * 0.00625
        width_normalized = width / WIDTH_NORMALIZATION_FACTOR

        num_slices_taken = round(width_normalized / SINGLE_SLICE_BANDWIDTH)
        channel_start_frequency = freq - (width_normalized / 2)
        starting_idx = round(
            (channel_start_frequency - MIN_FREQUENCY) / SINGLE_SLICE_BANDWIDTH
        )
        return list(range(starting_idx, starting_idx + num_slices_taken))

    @staticmethod
    def get_frequency_and_width_from_slice_list(slices: list[int]):
        """Convert list of slice indices to frequency and width

        Based on a list of slice indices, return their central frequency and width
        that they take up
        """
        min_frequency = 191.325
        single_slice_bandwidth = 0.00625
        start_freq = min_frequency + slices[0] * single_slice_bandwidth
        end_freq = min_frequency + (slices[-1] + 1) * single_slice_bandwidth

        return (
            round((start_freq + end_freq) / 2, 5),
            len(slices) * single_slice_bandwidth * WIDTH_NORMALIZATION_FACTOR,
            # denormalize, so that channel of width 0.05GHz
            # has a value of 50, as in the excel
        )

    @staticmethod
    def generate_channel_id() -> str:
        """Generate a unique channel ID"""
        return str(uuid.uuid4())
