from typing import Any, cast
from loguru import logger
import pyomo.environ as pyo
from attrs import define
from pyomo.opt import SolverResults
import uuid

from src.pzsp_backend.models import Channel, Edge, OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer
from src.pzsp_backend.optimization.integer.abstract import canonical_edge, model


@define
class IntegerProgrammingOptimizer(Optimizer):
    """Integer programming based optimizer backend."""

    # The weights we've discussed so far. Probably should add up to 1,
    # etc, but this is just a rough outline of how it's going to look like.
    # We might take in different params at the end of the day after all.
    distance_weight: float
    even_load_weight: float

    def find_channel(self, request: OptimisationRequest) -> Channel:
        model = self.instantiate_model(request)
        solver = pyo.SolverFactory("cbc")

        logger.info("Attempting to solve the model")

        result = solver.solve(model, tee=self.debug)

        logger.info("Solver finished")

        self.validate_solver_result(result)

        logger.info(f"Objective value: {model.obj()}")  # type: ignore

        logger.info("Selected Edges in the Path:")
        for e in model.Edges:  # type: ignore
            if pyo.value(model.x[canonical_edge(*e)]) > 0.5:  # type: ignore
                logger.info(e)

        logger.info("Selected Slice Indices:")
        for s in model.Slices:  # type: ignore
            if pyo.value(model.y[s]) > 0.5:  # type: ignore
                logger.info(s)

        return self.channel_from_solved_instance(model)

    def _generate_solver_input(self, request: OptimisationRequest):
        """Transforms the network object into a dictionary that can be later
        treated as the solver's input"""

        # Helper function to reduce unreadable boilerplate.
        # Passing None as a dictionary key is the way of instantiating scalar & dict values in pyomo
        def pyo_mapping(v: Any):
            return {None: v}

        edges = [
            canonical_edge(e.node1Id, e.node2Id) for e in self.network.edges.values()
        ]
        logger.warning(f"edges: { edges }")

        nodes = list(self.network.nodes.keys())
        logger.warning(f"nodes: { nodes }")
        weights = {
            canonical_edge(e.node1Id, e.node2Id): self.calculate_edge_weight(e)
            for e in self.network.edges.values()
        }
        logger.warning(f"weights: { weights }")

        occupied = self.edge_slice_occupancy_map()

        return pyo_mapping(
            {
                "S": pyo_mapping(self.num_slices_from_bandwidth(request.bandwidth)),
                "Nodes": nodes,
                "Edges": edges,
                "Weights": weights,
                "Source": pyo_mapping(request.source),
                "Target": pyo_mapping(request.target),
                "Slices": list(range(768)),
                "Occupied": occupied,
            }
        )

    def calculate_edge_weight(self, e: Edge) -> float:
        """Calculates the weights of an edge based on the optimizer's params"""
        return (
            self.distance_weight * self.network.edge_length(e)
            + self.even_load_weight * e.provisionedCapacity
        )

    def instantiate_model(self, request: OptimisationRequest) -> pyo.ConcreteModel:
        """Creates a concrete model based on the network and
        weights"""
        data = self._generate_solver_input(request)
        instance = model.create_instance(data)
        return cast(pyo.ConcreteModel, instance)

    def validate_solver_result(self, result: SolverResults):
        """Checks whether the solver exited succesfully and found a solution
        and whines if it didn't"""
        logger.info("Validating solver result")

        if status := result.solver.status != "ok":
            # TODO: dump solver output
            logger.error(f"Solver terminated unsuccesfully: {status}")
            raise RuntimeError(f"Solver terminated unsuccesfully: {status}")

        term_cond = str(result.solver.termination_condition).lower()
        if "optimal" not in term_cond:
            logger.error(
                f"No optimal solution found. Solver termination condition: {term_cond}"
            )
            raise RuntimeError(
                f"No optimal solution found. Solver termination condition: {term_cond}"
            )

    def channel_from_solved_instance(self, model: pyo.ConcreteModel) -> Channel:
        """Creates a channel object from the solver's result"""
        edge_node_ids: list[tuple[str, str]] = [e for e in model.Edges]  # type: ignore
        edges = [self.network.find_edge_by_node_ids(*ids) for ids in edge_node_ids]

        node_ids = set()
        for e in edges:
            node_ids.add(e.node1Id)
            node_ids.add(e.node2Id)

        starting_slice = [s for s in model.Slices if pyo.value(model.y[s]) > 0.5][0]  # type: ignore
        num_slices = pyo.value(model.S)
        freq, width = self.get_frequency_and_width_from_slice_list(
            list(range(starting_slice, starting_slice + num_slices))
        )

        return Channel(
            id=str(uuid.uuid4()),
            edges=[e.id for e in edges],
            nodes=list(node_ids),
            frequency=freq,
            width=width,
        )
