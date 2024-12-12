import {GraphCanvas, InternalGraphEdge, InternalGraphNode} from "reagraph";
import {useState} from "react";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";

export const GraphVisualisationDemo = () => {
  const [text, setText] = useState("");
  const {network, highlightedChannelId} = useNetwork();

  if (!network) {
    return <p>Network not loaded</p>;
  }

  const highlightedChannel = highlightedChannelId ? network.channels[highlightedChannelId] : null;

  const nodes = Object.values(network.nodes).map(node => {
    return {
      id: node.id,
      label: node.id,
      x: node.longitude,
      y: node.latitude,
      fill: highlightedChannel?.nodes.includes(node.id) ? "#FF0000" : "#0000FF"
    };
  });

  const edges = Object.values(network.edges).map(edge => {
    return {
      source: edge.node1Id,
      target: edge.node2Id,
      id: edge.id,
      label: `${edge.node1Id}-${edge.node2Id}`,
      fill: highlightedChannel?.edges.includes(edge.id) ? "#FF0000" : "#0000FF"
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
          edgeArrowPosition={"none"}
        />
      </div>
    </>
  );
}