import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {calcNodeDistance} from "../NetworkModel/calcNodeDistance.ts";


export const EdgeStats = () => {
  const {network, selectedEdgeId} = useNetwork();
  if (!network || !selectedEdgeId) {
    return null;
  }
  const edge = network.edges[selectedEdgeId];
  const length = calcNodeDistance(network!.nodes[edge.node1Id], network!.nodes[edge.node2Id]);

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Wybrana krawędź</CardTitle>
    </CardHeader>
    <CardContent>
      <p>ID: {edge.id}</p>
      <p>Łączy węzły: {edge.node1Id}, {edge.node2Id}</p>
      <p>Zajęte pasmo: {edge.provisionedCapacity}%</p>
      <p>Długość: {Math.round(length)}km</p>
    </CardContent>
  </Card>
}