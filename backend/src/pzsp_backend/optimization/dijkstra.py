import heapq

from attrs import define
from loguru import logger

from src.pzsp_backend.models import Channel, Edge, OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer
from src.pzsp_backend.optimization.constants import TOTAL_SLICES

NodeId = str
EdgeId = str
SliceIdx = int
OccupancyMap = dict[EdgeId, list[bool]]
PreviousNodes = dict[tuple[NodeId, SliceIdx], tuple[NodeId | None, SliceIdx | None]]


@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""

    def find_channel(self, request: OptimisationRequest) -> Channel:
        n_slices = self.num_slices_from_bandwidth(request.bandwidth)
        node_ids, slice_idx = self.modified_dijkstra(
            request.source, request.target, n_slices
        )
        logger.info("Node IDs: ", node_ids)
        return self.reconstruct_channel(node_ids, slice_idx, n_slices)

    def modified_dijkstra(
        self, source: NodeId, target: NodeId, n_slices: int
    ) -> tuple[list[NodeId], SliceIdx]:
        """Modified Dijkstra algorithm

        Finds the lowest cost path in a graph with additional constraint.
        The path must be continuous in the slice dimension and the requested
        number of slices must be free on each edge.
        """
        occupancy = self.make_slice_occupancy_map()
        slice_range = range(TOTAL_SLICES - n_slices + 1)

        # cost, node_id, slice_idx
        priority_queue: list[tuple[float, NodeId, SliceIdx]] = [(0, source, 0)]

        lowest_costs = {
            (node_id, slice_idx): float("inf")
            for node_id in self.network.nodes
            for slice_idx in slice_range
        }
        lowest_costs[(source, 0)] = 0

        previous_nodes: PreviousNodes = {
            (node_id, slice_idx): (None, None)
            for node_id in self.network.nodes
            for slice_idx in slice_range
        }

        while priority_queue:
            current_cost, current_node, current_slice = heapq.heappop(priority_queue)

            if current_node == target:
                break

            for neighbor_id in self.network.nodes[current_node].neighbors:
                edge = self.network.find_edge_by_node_ids(current_node, neighbor_id)
                edge_cost = self.calculate_edge_weight(edge)
                cost = current_cost + edge_cost

                for slice_idx in slice_range:
                    if self.are_slices_free(edge, slice_idx, n_slices, occupancy):
                        if cost < lowest_costs[(neighbor_id, slice_idx)]:
                            lowest_costs[(neighbor_id, slice_idx)] = cost
                            previous_nodes[(neighbor_id, slice_idx)] = (
                                current_node,
                                current_slice,
                            )
                            heapq.heappush(
                                priority_queue, (cost, neighbor_id, slice_idx)
                            )

        # Reconstruct the lowest cost path
        path = []
        slice_indices = []
        current_node, current_slice = target, 0
        while current_node is not None:
            path.append(current_node)
            slice_indices.append(current_slice)
            current_node, current_slice = previous_nodes[(current_node, current_slice)]
        path.reverse()
        slice_indices.reverse()

        slice_idx = slice_indices[0]
        if not all(s == slice_idx for s in slice_indices):
            logger.warning("The path is not continuous in the slice dimension")

        return path, slice_idx

    @staticmethod
    def are_slices_free(
        edge: Edge, start_slice: SliceIdx, n_slices: int, occupancy: OccupancyMap
    ) -> bool:
        """Check if the sequence of slices is free on the edge."""
        return all(
            not occupancy[edge.id][i]
            for i in range(start_slice, start_slice + n_slices)
        )

    def make_slice_occupancy_map(self) -> OccupancyMap:
        """Create a dictionary edge_id: slice_occupancy
        where slice_occupancy is a list of booleans (False - free, True - occupied)."""
        occupancy = {edge_id: [False] * TOTAL_SLICES for edge_id in self.network.edges}

        for channel in self.network.channels.values():
            slice_idxs = self.get_slice_indices_from_freq_and_width(
                channel.width, channel.frequency
            )
            for edge_id in channel.edges:
                for slice_idx in slice_idxs:
                    occupancy[edge_id][slice_idx] = True

        return occupancy

    def edges_from_node_ids(self, node_ids: list[str]) -> list[Edge]:
        return [
            self.network.find_edge_by_node_ids(a, b)
            for a, b in zip(node_ids[:-1], node_ids[1:])
        ]

    def reconstruct_channel(
        self, node_ids: list[str], slice_idx: SliceIdx, n_slices: int
    ) -> Channel:
        edges = self.edges_from_node_ids(node_ids)
        occupied_slices = list(range(slice_idx, slice_idx + n_slices))
        frequency, width = self.get_frequency_and_width_from_slice_list(occupied_slices)

        return Channel(
            id=self.generate_channel_id(),
            edges=[e.id for e in edges],
            nodes=node_ids,
            frequency=frequency,
            width=width,
        )
