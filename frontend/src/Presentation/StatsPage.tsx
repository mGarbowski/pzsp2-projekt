import { GraphVisualisationDemo } from "./GraphVisualisationDemo.tsx";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";

export const StatsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center' }}>
      <h1>Presentation</h1>
      <div style={{ position: 'fixed', top: "20%", left: "5%", width: '45%', height: '100%', overflow: 'auto' }}>
        <DownloadReport />
      </div>
      <div style={{ position: 'fixed', top: "20%", right: "5%", width: '45%', height: '100%', overflow: 'auto' }}>
        <GraphVisualisationDemo />
      </div>
    </div>
  )
}
