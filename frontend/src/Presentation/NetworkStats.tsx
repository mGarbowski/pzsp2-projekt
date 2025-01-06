import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";

export const NetworkStats = () => {
  const {network} = useNetwork();
  if (!network) {
    return null;
  }

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