import {GraphCanvas} from "reagraph";

export const PresentationPage = () => {
  const nodes = [
    { id: '1', label: '1', x: 100, y: 100 },
    { id: '2', label: '2', x: 200, y: 100 },
    { id: '3', label: '3', x: 300, y: 100 },
    { id: '4', label: '4', x: 400, y: 100 },
    { id: '5', label: '5', x: 500, y: 100 }
  ];

  const edges = [
    { source: '1', target: '2', id: '1-2', label: '1-2' },
    { source: '2', target: '1', id: '2-1', label: '2-1' },
    { source: '1', target: '3', id: '1-3', label: '1-3' },
    { source: '3', target: '4', id: '3-4', label: '3-4' },
    { source: '4', target: '5', id: '4-5', label: '4-5' },
    { source: '5', target: '1', id: '5-1', label: '5-1' }
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center'}}>
      <h1>Presentation</h1>
      <div style={{position: "fixed", top: "20%", width: '75%', height: '75%'}}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
        />
      </div>
    </div>
  )
}