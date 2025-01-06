import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import styled from "@emotion/styled";


export const NodeStats = () => {
  const {network, selectedNodeId, setSelectedNodeId} = useNetwork();
  if (!network || !selectedNodeId) {
    return null;
  }

  const node = network.nodes[selectedNodeId];

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Wybrany węzeł</CardTitle>
    </CardHeader>
    <CardContent>
      <p>ID: {node.id}</p>
      <p>Szerokość: {node.latitude}</p>
      <p>Długość: {node.longitude}</p>
      <p>Stopień: {node.neighbors.length}</p>
      <p>Sąsiedzi:</p>
      <List>
        {node.neighbors.map((neighbor) => (
          <li key={neighbor}>
            <button onClick={() => setSelectedNodeId(neighbor)}>{neighbor}</button>
          </li>
        ))}
      </List>
    </CardContent>
  </Card>
}

const List = styled.ul({
  marginLeft: "1rem"
})