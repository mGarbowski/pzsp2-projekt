from attrs import define

from src.pzsp_backend.models import Channel, OptimisationRequest
from src.pzsp_backend.optimization.base import Optimizer


@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""

    def find_channel(self, request: OptimisationRequest) -> Channel:
        raise NotImplementedError()
