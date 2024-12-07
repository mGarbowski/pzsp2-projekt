import {GraphVisualisationDemo} from "./GraphVisualisationDemo.tsx";

export const PresentationPage = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center'}}>
      <h1>Presentation</h1>
      <GraphVisualisationDemo/>
    </div>
  )
}