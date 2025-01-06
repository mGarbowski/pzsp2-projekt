import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {Channel, Network} from "../NetworkModel/network.ts";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";


const channelWithMaxLoad = (network: Network): Channel => {
  let maxLoad = -Infinity;
  let maxLoadChannel = null;
  const channels = Object.values(network.channels);

  channels.forEach(channel => {
    const edges = channel.edges.map(edgeId => network.edges[edgeId]);
    const totalCapacity = edges.reduce((acc, edge) => acc + edge.provisionedCapacity, 0);
    const avgCapacity = totalCapacity / edges.length;

    if (avgCapacity > maxLoad) {
      maxLoad = avgCapacity;
      maxLoadChannel = channel;
    }
  });

  return maxLoadChannel!;
}

const overallNetworkLoad = (network: Network) => {
  const edges = Object.values(network.edges);
  const totalLoad = edges
    .map((edge) => edge.provisionedCapacity)
    .reduce((acc, load) => acc + load, 0);
  const avgLoad = totalLoad / edges.length;
  return Math.round(avgLoad);
}

export const NetworkStats = () => {
  const {network, setHighlightedChannelId} = useNetwork();
  if (!network) {
    return null;
  }

  const edges = Object.values(network.edges);
  const channels = Object.values(network.channels);

  const nodeCount = Object.values(network.nodes).length ?? 0;
  const edgeCount = edges.length ?? 0;
  const channelCount = channels.length ?? 0;
  const maxLoadChannelId = channelWithMaxLoad(network).id;

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Sieć</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Liczba węzłów: {nodeCount}</p>
      <p>Liczba krawędzi: {edgeCount}</p>
      <p>Liczba kanałów: {channelCount}</p>
      <p>Całkowite obciążenie: {overallNetworkLoad(network)}%</p>
      <p>Najbardziej obciążony kanał:
        <button
          onClick={() => setHighlightedChannelId(maxLoadChannelId)}>
          {maxLoadChannelId}
        </button></p>
    </CardContent>
  </Card>
}