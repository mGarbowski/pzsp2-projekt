import heapq

from attrs import define

from src.pzsp_backend.models import Channel, ChannelDescription, Network, Edge
from src.pzsp_backend.optimization.base import Optimizer


@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""
    source: str
    target: str
    network: Network
    distance_weight: float
    even_load_weight: float
    n_slices: int

    def find_channel(self, description: ChannelDescription) -> Channel:
        raise NotImplementedError()

    def calculate_edge_weight(self, edge: Edge) -> float:
        distance = self.network.edge_length(edge)
        return self.distance_weight * distance + self.even_load_weight * edge.provisionedCapacity

    def find_shortest_path(self):
        # Initialize the priority queue with the source node
        priority_queue = [(0, self.source)]
        # Dictionary to store the shortest distance to each node
        shortest_distances = {node_id: float('inf') for node_id in self.network.nodes}
        shortest_distances[self.source] = 0
        # Dictionary to store the previous node in the optimal path
        previous_nodes = {node_id: None for node_id in self.network.nodes}

        while priority_queue:
            current_distance, current_node = heapq.heappop(priority_queue)

            # If the current node is the target, we can stop
            if current_node == self.target:
                break

            # Explore neighbors
            for neighbor_id in self.network.nodes[current_node].neighbors:
                edge = self.network.find_edge_by_node_ids(current_node, neighbor_id)
                weight = self.calculate_edge_weight(edge)
                distance = current_distance + weight

                # If a shorter path to the neighbor is found
                if distance < shortest_distances[neighbor_id]:
                    shortest_distances[neighbor_id] = distance
                    previous_nodes[neighbor_id] = current_node
                    heapq.heappush(priority_queue, (distance, neighbor_id))

        # Reconstruct the shortest path
        path = []
        current_node = self.target
        while current_node is not None:
            path.append(current_node)
            current_node = previous_nodes[current_node]
        path.reverse()

        return path




