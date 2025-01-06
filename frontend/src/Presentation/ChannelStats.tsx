import {Channel} from "../NetworkModel/network.ts";
import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {calcNodeDistance} from "../NetworkModel/calcNodeDistance.ts";

interface ChannelStatsProps {
  channel: Channel;
}

export const ChannelStats = (props: ChannelStatsProps) => {
  const {network} = useNetwork();
  const {channel} = props;


  const edges = Object.values(channel.edges).join(", ");
  const nodes = Object.values(channel.nodes).join(", ");
  const edgeCount = Object.values(channel.edges).length ?? 0;
  const totalLength = channel.edges.map((edgeId) => {
    const edge = network!.edges[edgeId];
    return calcNodeDistance(network!.nodes[edge.node1Id], network!.nodes[edge.node2Id]);
  }).reduce((acc, length) => acc + length, 0);


  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Wybrany Kanał</CardTitle>
    </CardHeader>
    <CardContent>
      <p>ID: {channel.id}</p>
      <p>Liczba krawędzi: {edgeCount}</p>
      <p>Długość: {Math.round(totalLength)} km</p>
      <p>Węzły: {nodes}</p>
      <p>Krawędzie: {edges}</p>
      <p>Częstotliwość środkowa: {channel.frequency} THz</p>
      <p>Szerokość pasma: {channel.width} GHz</p>
    </CardContent>
  </Card>
}