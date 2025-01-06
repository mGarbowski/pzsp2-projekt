import heapq

from attrs import define
from src.pzsp_backend.models import Channel, Edge
from src.pzsp_backend.models import OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer


@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""

    def find_channel(self, request: OptimisationRequest) -> Channel:
        node_ids = self.find_shortest_path(request.source, request.target, request)
        print("Node IDs: ", node_ids)
        return self.reconstruct_channel(node_ids)

    def calculate_edge_weight(self, edge: Edge, request: OptimisationRequest) -> float:
        distance = self.network.edge_length(edge)
        return request.distanceWeight * distance + request.evenLoadWeight * edge.provisionedCapacity

    def find_shortest_path(self, source: str, target: str, request: OptimisationRequest) -> list[str]:
        # Initialize the priority queue with the source node
        priority_queue = [(0, source)]
        # Dictionary to store the shortest distance to each node
        shortest_distances = {node_id: float('inf') for node_id in self.network.nodes}
        shortest_distances[source] = 0
        # Dictionary to store the previous node in the optimal path
        previous_nodes = {node_id: None for node_id in self.network.nodes}

        while priority_queue:
            current_distance, current_node = heapq.heappop(priority_queue)

            # If the current node is the target, we can stop
            if current_node == target:
                break

            # Explore neighbors
            for neighbor_id in self.network.nodes[current_node].neighbors:
                edge = self.network.find_edge_by_node_ids(current_node, neighbor_id)
                weight = self.calculate_edge_weight(edge, request)
                distance = current_distance + weight

                # If a shorter path to the neighbor is found
                if distance < shortest_distances[neighbor_id]:
                    shortest_distances[neighbor_id] = distance
                    previous_nodes[neighbor_id] = current_node
                    heapq.heappush(priority_queue, (distance, neighbor_id))

        # Reconstruct the shortest path
        path = []
        current_node = target
        while current_node is not None:
            path.append(current_node)
            current_node = previous_nodes[current_node]
        path.reverse()

        return path

    def edges_from_node_ids(self, node_ids: list[str]) -> list[Edge]:
        return [
            self.network.find_edge_by_node_ids(a, b)
            for a, b in zip(node_ids[:-1], node_ids[1:])
        ]

    def reconstruct_channel(self, node_ids: list[str]) -> Channel:
        edges = self.edges_from_node_ids(node_ids)

        return Channel(
            id=self.generate_channel_id(),
            edges=[e.id for e in edges],
            nodes=node_ids,
            frequency=0,  # TODO
            width=0,  # TODO
        )
