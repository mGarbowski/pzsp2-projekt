import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";


export const NodeStats = () => {
  const {network, selectedNodeId} = useNetwork();
  if (!network || !selectedNodeId) {
    return null;
  }

  const node = network.nodes[selectedNodeId];

  const neighbors = node.neighbors.join(", ");

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Wybrany węzeł</CardTitle>
    </CardHeader>
    <CardContent>
      <p>ID: {node.id}</p>
      <p>Szerokość: {node.latitude}</p>
      <p>Długość: {node.longitude}</p>
      <p>Stopień: {node.neighbors.length}</p>
      <p>Sąsiedzi: {neighbors}</p>
    </CardContent>
  </Card>
}