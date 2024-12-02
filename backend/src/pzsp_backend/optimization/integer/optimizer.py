from attrs import define
from pzsp_backend.models import Channel, ChannelDescription
from pzsp_backend.optimization.base import Optimizer
import pyomo.environ as pyo


@define
class IntegerProgrammingOptimizer(Optimizer):
    """Integer programming based optimizer backend."""

    # The weights we've discussed so far. Probably should add up to 1,
    # etc, but this is just a rough outline of how it's going to look like.
    # We might take in different params at the end of the day after all.
    all_around_load_weight: int
    even_load_weight: int

    def find_channel(self, description: ChannelDescription) -> Channel:
        raise NotImplementedError()

    def instantiate_model(self) -> pyo.ConcreteModel:
        """Creates a concrete model based on the network and
        weights"""
        raise NotImplementedError()
