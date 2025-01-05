from typing import Any, cast
import pyomo.environ as pyo
from attrs import define

from src.pzsp_backend.models import Channel, ChannelDescription, Edge
from src.pzsp_backend.optimization.base import Optimizer
from src.pzsp_backend.optimization.integer.abstract import model


@define
class IntegerProgrammingOptimizer(Optimizer):
    """Integer programming based optimizer backend."""

    # The weights we've discussed so far. Probably should add up to 1,
    # etc, but this is just a rough outline of how it's going to look like.
    # We might take in different params at the end of the day after all.
    all_around_load_weight: int
    even_load_weight: int

    def find_channel(self, description: ChannelDescription) -> Channel:
        model = self.instantiate_model(description)
        solver = pyo.SolverFactory("cbc")
        result = solver.solve(model, tee=self.debug)
        return Channel.from_solver_result(result)

    def _generate_solver_input(self, description: ChannelDescription):
        """Transforms the network object into a dictionary that can be later
        treated as the solver's input"""

        # Helper function to reduce unreadable boilerplate.
        # Passing None as a dictionary key is the way of instantiating scalar & dict values in pyomo
        def pyo_mapping(v: Any):
            return {None: {v}}

        return {
            "S": int(
                description.throughput
            ),  # TODO: calculate number of slices needed based on throughput
            "Nodes": [n.id for n in self.network.nodes],
            "Edges": [(e.node1_id, e.node2_id) for e in self.network.edges],
            "Weights": {
                (e.node1_id, e.node2_id): self.calculate_edge_weight(e)
                for e in self.network.edges
            },
            "Source": pyo_mapping(description.start.id),
            "Target": pyo_mapping(description.end.id),
            "Slices": list(range(768)),
            "Occupied": {
                # TODO: rethink slice occupancy representation
            },
        }

    def calculate_edge_weight(self, e: Edge):
        """Calculates the weights of an edge based on the optimizer's params"""
        raise NotImplementedError()

    def instantiate_model(self, description: ChannelDescription) -> pyo.ConcreteModel:
        """Creates a concrete model based on the network and
        weights"""
        data = self._generate_solver_input(description)
        instance = model.create_instance(data)
        return cast(pyo.ConcreteModel, instance)
