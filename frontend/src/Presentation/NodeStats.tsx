import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {Node} from "../NetworkModel/network.ts";

interface NodeStatsProps {
  node: Node;
}

export const NodeStats = (props: NodeStatsProps) => {
  const {node} = props;

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