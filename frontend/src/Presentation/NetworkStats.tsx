import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {Network} from "../NetworkModel/network.ts";

interface NetworkStatsProps {
  network: Network;
}

export const NetworkStats = (props: NetworkStatsProps) => {
  const {network} = props;

  const nodeCount = Object.values(network.nodes).length ?? 0;
  const edgeCount = Object.values(network.edges).length ?? 0;
  const channelCount = Object.values(network.channels).length ?? 0;


  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Sieć</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Liczba węzłów: {nodeCount}</p>
      <p>Liczba krawędzi: {edgeCount}</p>
      <p>Liczba kanałów: {channelCount}</p>
    </CardContent>
  </Card>
}