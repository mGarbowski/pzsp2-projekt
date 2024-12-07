import {GraphVisualisationDemo} from "./GraphVisualisationDemo.tsx";
import {DownloadReport} from "../ReportGeneration/DownloadReport.tsx";

export const PresentationPage = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center'}}>
      <h1>Presentation</h1>
      <GraphVisualisationDemo/>
      <DownloadReport/>
    </div>
  )
}