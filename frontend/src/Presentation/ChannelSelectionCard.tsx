import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";

export const ChannelSelectionCard = () => {
  const {network, setHighlightedChannelId} = useNetwork();
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
      <ul>
        {channelIds.map((id) => (
          <li key={id}>
            <button onClick={() => setHighlightedChannelId(id)}>{id}</button>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
}