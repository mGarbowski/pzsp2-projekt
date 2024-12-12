import {GraphCanvas, InternalGraphEdge, InternalGraphNode} from "reagraph";
import {useState} from "react";
import {demoNetwork} from "../NetworkModel/demoNetwork.ts";

export const GraphVisualisationDemo = () => {
  const [text, setText] = useState("");
  const network = demoNetwork;

  const nodes = Object.values(network.nodes).map(node => {
    return {
      id: node.id,
      label: node.id,
      x: node.longitude,
      y: node.latitude
    };
  });

  const edges = Object.values(network.edges).map(edge => {
    return {
      source: edge.node1Id,
      target: edge.node2Id,
      id: edge.id,
      label: `${edge.node1Id}-${edge.node2Id}`
    };
  });


  const handleNodeClick = (node: InternalGraphNode) => {
    console.log(node);
    setText("Node " + node.id + " clicked");
  };

  const handleEdgeClick = (edge: InternalGraphEdge) => {
    console.log(edge);
    setText("Edge " + edge.id + " clicked");
  }

  return (
    <>
      <p>{text}</p>
      <div style={{position: "fixed", top: "30%", width: '45%', height: '50%'}}>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
        />
      </div>
    </>
  );
}