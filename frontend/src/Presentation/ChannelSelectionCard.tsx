import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import styled from "@emotion/styled";

export const ChannelSelectionCard = () => {
  const {network, setSelectedChannelId} = useNetwork();
  if (!network) {
    return null;
  }
  const channelIds = Object.keys(network.channels);

  return <Card>
    <CardHeader>
      <CardTitle className="text-xl">Kanały</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Wybierz aby zaznaczyć na podglądzie</p>
      <List>
        {channelIds.map((id) => (
          <li key={id}>
            <button onClick={() => setSelectedChannelId(id)}>{id}</button>
          </li>
        ))}
      </List>
    </CardContent>
  </Card>
}

const List = styled.ul({
  marginTop: "1rem",
  height: "8rem",
  overflowY: "auto",
})