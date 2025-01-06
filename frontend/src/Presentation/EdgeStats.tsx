import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {calcNodeDistance} from "../NetworkModel/calcNodeDistance.ts";
import styled from "@emotion/styled";


export const EdgeStats = () => {
  const {network, selectedEdgeId, setSelectedNodeId} = useNetwork();
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
      <p>Zajęte pasmo: {edge.provisionedCapacity}%</p>
      <p>Długość: {Math.round(length)}km</p>
      <p>Łączy węzły:</p>
      <List>
        <li><button onClick={() => setSelectedNodeId(edge.node1Id)}>{edge.node1Id}</button></li>
        <li><button onClick={() => setSelectedNodeId(edge.node2Id)}>{edge.node2Id}</button></li>
      </List>
    </CardContent>
  </Card>
}

const List = styled.ul({
  marginLeft: "1rem",
});