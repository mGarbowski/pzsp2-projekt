import { GraphCanvas, InternalGraphEdge, InternalGraphNode, InternalGraphPosition } from "reagraph";
import { useState } from "react";
import { useNetwork } from "../NetworkModel/NetworkContext.tsx";

export const GraphVisualisationDemo = () => {
  const [text, setText] = useState("");
  const { network, highlightedChannelId } = useNetwork();

  if (!network) {
    return <p className="flex justify-center align-middle font-bold">Dane sieci niezaładowane</p>;
  }

  const highlightedChannel = highlightedChannelId ? network.channels[highlightedChannelId] : null;

  const visNodes = Object.values(network.nodes).map(node => {
    return {
      id: node.id,
      label: node.id,
      x: node.longitude,
      y: node.latitude,
      fill: highlightedChannel?.nodes.includes(node.id) ? "#FF0000" : "#0000FF"
    };
  });

  const visEdges = Object.values(network.edges).map(edge => {
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

  const calcNodeCoordinates = (id: string) => {
    const center = { latitude: 52.2297, longitude: 21.0122 }; // Warsaw
    const scale = 50;

    const node = network.nodes[id];
    const x = (node.longitude - center.longitude) * scale;
    const y = (node.latitude - center.latitude) * scale;
    return { x, y, z: 1 } as InternalGraphPosition;
  }

  return (
    <>
      <p>{text}</p>
      <div style={{ position: "fixed", top: "27%", width: '45%', height: '50%', marginRight: "3rem" }}>
        <GraphCanvas
          nodes={visNodes}
          edges={visEdges}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          edgeArrowPosition={"none"}
          layoutType={"custom"}
          layoutOverrides={({ getNodePosition: calcNodeCoordinates })}
        />
      </div>
    </>
  );
}
