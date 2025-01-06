import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {calcNodeDistance} from "../NetworkModel/calcNodeDistance.ts";
import styled from "@emotion/styled";
import {Channel, Network} from "../NetworkModel/network.ts";


const totalChannelLength = (network: Network, channel: Channel) => {
  const totalLength = channel.edges
    .map((edgeId) => {
      const edge = network!.edges[edgeId];
      return calcNodeDistance(network!.nodes[edge.node1Id], network!.nodes[edge.node2Id]);
    })
    .reduce((acc, length) => acc + length, 0);
  return Math.round(totalLength);
}

export const ChannelStats = () => {
  const {network, selectedChannelId, setSelectedNodeId, setSelectedEdgeId} = useNetwork();
  if (!network || !selectedChannelId) {
    return null;
  }

  const channel = network.channels[selectedChannelId];
  const edgeCount = channel.edges.length ?? 0;

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Wybrany Kanał</CardTitle>
    </CardHeader>
    <CardContent>
      <p>ID: {channel.id}</p>
      <p>Liczba krawędzi: {edgeCount}</p>
      <p>Długość: {totalChannelLength(network, channel)} km</p>
      <p>Częstotliwość środkowa: {channel.frequency} THz</p>
      <p>Szerokość pasma: {channel.width} GHz</p>
      <p>Węzły:</p>
      <List>
        {channel.nodes.map((nodeId) => (
          <li key={nodeId}>
            <button onClick={() => setSelectedNodeId(nodeId)}>{nodeId}</button>
          </li>
        ))}
      </List>
      <p>Krawędzie:</p>
      <List>
        {channel.edges.map((edgeId) => (
          <li key={edgeId}>
            <button onClick={() => setSelectedEdgeId(edgeId)}>{edgeId}</button>
          </li>
        ))}
      </List>
    </CardContent>
  </Card>
}

const List = styled.ul({
  marginLeft: "1rem"
})