import { GraphVisualisationDemo } from "./GraphVisualisationDemo.tsx";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNetwork } from "../NetworkModel/NetworkContext.tsx";
import { useState } from "react";

export const PresentationPage = () => {
  const [counter, setCounter] = useState(0);
  const { network, setHighlightedChannelId } = useNetwork();

  const onFindChannel = () => {
    if (!network) {
      return;
    }
    setTimeout(() => {
      const channelIdx = counter % Object.keys(network.channels).length;
      const channel = Object.keys(network.channels)[channelIdx];
      setCounter(counter + 1);
      setHighlightedChannelId(channel);
    }, 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center' }}>
      <h1>Presentation</h1>
      <div style={{ position: 'fixed', top: "20%", left: "5%", width: '45%', height: '100%', overflow: 'auto' }}>
        <DownloadReport />
        <button onClick={onFindChannel}>Find channel</button>
      </div>
      <div style={{ position: 'fixed', top: "20%", right: "5%", width: '45%', height: '100%', overflow: 'auto' }}>
        <GraphVisualisationDemo />
      </div>
    </div>
  )
}
