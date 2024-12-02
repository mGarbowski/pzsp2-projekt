from attrs import define

from pzsp_backend.models import Channel, ChannelDescription
from pzsp_backend.optimization.base import Optimizer


@define
class DijkstraOptimizer(Optimizer):
    """Dijkstra's algorithm optimizer"""

    def find_channel(self, description: ChannelDescription) -> Channel:
        raise NotImplementedError()
