import heapq

from attrs import define
from loguru import logger

from src.pzsp_backend.models import Channel, Edge
from src.pzsp_backend.models import OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer

OccupancyMap = dict[str, list[bool]]

@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""

    def find_channel(self, request: OptimisationRequest) -> Channel:
        n_slices = self.num_slices_from_bandwidth(request.bandwidth)
        node_ids, slice_idx = self.find_shortest_path(request.source, request.target, request, n_slices)
        logger.info("Node IDs: ", node_ids)
        return self.reconstruct_channel(node_ids, slice_idx, n_slices)

    def calculate_edge_weight(self, edge: Edge, request: OptimisationRequest) -> float:
        distance = self.network.edge_length(edge)
        return request.distanceWeight * distance + request.evenLoadWeight * edge.provisionedCapacity

    def find_shortest_path(self, source: str, target: str, request: OptimisationRequest, n_slices: int) -> tuple[list[str], int]:
        occupancy = self.make_slice_occupancy_map()

        # Initialize the priority queue with the source node and slice index 0
        priority_queue = [(0, source, 0)]
        # Dictionary to store the shortest distance to each node and slice index
        shortest_distances = {(node_id, slice_idx): float('inf') for node_id in self.network.nodes for slice_idx in
                              range(768 - n_slices + 1)}
        shortest_distances[(source, 0)] = 0
        # Dictionary to store the previous node and slice index in the optimal path
        previous_nodes = {(node_id, slice_idx): (None, None) for node_id in self.network.nodes for slice_idx in
                          range(768 - n_slices + 1)}

        while priority_queue:
            current_distance, current_node, current_slice = heapq.heappop(priority_queue)

            # If the current node is the target, we can stop
            if current_node == target:
                break

            # Explore neighbors
            for neighbor_id in self.network.nodes[current_node].neighbors:
                edge = self.network.find_edge_by_node_ids(current_node, neighbor_id)
                weight = self.calculate_edge_weight(edge, request)
                distance = current_distance + weight

                # Check for available slices
                for slice_idx in range(768 - n_slices + 1):
                    if self.are_slices_free(edge, slice_idx, n_slices, occupancy):
                        # If a shorter path to the neighbor is found
                        if distance < shortest_distances[(neighbor_id, slice_idx)]:
                            shortest_distances[(neighbor_id, slice_idx)] = distance
                            previous_nodes[(neighbor_id, slice_idx)] = (current_node, current_slice)
                            heapq.heappush(priority_queue, (distance, neighbor_id, slice_idx))

        # Reconstruct the shortest path
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

    def are_slices_free(self, edge: Edge, start_slice: int, n_slices: int, occupancy: OccupancyMap) -> bool:
        """Check if the slices from start_slice to start_slice + S - 1 are free on the edge."""
        return all(not occupancy[edge.id][i] for i in range(start_slice, start_slice + n_slices))

    def make_slice_occupancy_map(self) -> OccupancyMap:
        """Create a dictionary edge_id: slice_occupancy
        where slice_occupancy is a list of booleans (False - free, True - occupied)."""
        occupancy = {edge_id: [False] * 768 for edge_id in self.network.edges}

        for channel in self.network.channels.values():
            slice_idxs = self.get_slice_indices_from_freq_and_width(channel.width, channel.frequency)
            for edge_id in channel.edges:
                for slice_idx in slice_idxs:
                    occupancy[edge_id][slice_idx] = True

        return occupancy

    def edges_from_node_ids(self, node_ids: list[str]) -> list[Edge]:
        return [
            self.network.find_edge_by_node_ids(a, b)
            for a, b in zip(node_ids[:-1], node_ids[1:])
        ]

    def reconstruct_channel(self, node_ids: list[str], slice_idx: int, n_slices: int) -> Channel:
        edges = self.edges_from_node_ids(node_ids)
        frequency, width = self.get_frequency_and_width_from_slice_list(
            list(range(slice_idx, slice_idx + n_slices))
        )

        return Channel(
            id=self.generate_channel_id(),
            edges=[e.id for e in edges],
            nodes=node_ids,
            frequency=frequency,
            width=width,
        )
