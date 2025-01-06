import { GraphCanvas, InternalGraphEdge, InternalGraphNode, InternalGraphPosition } from "reagraph";
import { useState } from "react";
import { useNetwork } from "../NetworkModel/NetworkContext.tsx";

export const GraphVisualisationDemo = () => {
  const [text, setText] = useState("");
  const { network, selectedChannelId, setSelectedNodeId, setSelectedEdgeId, selectedEdgeId, selectedNodeId } = useNetwork();

  const nodeSize = 2;

  if (!network) {
    return <p className="flex justify-center align-middle font-bold">Dane sieci niezaładowane</p>;
  }

  const highlightedChannel = selectedChannelId ? network.channels[selectedChannelId] : null;

  const normalColor = "#0000FF";
  const channelColor = "#FF0000";
  const selectedColor = "#00FF00";

  const nodeColor = (nodeId: string) => {
    if (selectedNodeId === nodeId) {
      return selectedColor;
    }

    if (highlightedChannel?.nodes.includes(nodeId)) {
      return channelColor;
    }

    return normalColor;
  }

  const edgeColor = (edgeId: string) => {
    if (selectedEdgeId === edgeId) {
      return selectedColor;
    }

    if (highlightedChannel?.edges.includes(edgeId)) {
      return channelColor;
    }

    return normalColor;
  }

  const visNodes = Object.values(network.nodes).map(node => {
    return {
      id: node.id,
      label: node.id,
      x: node.longitude,
      y: node.latitude,
      fill: nodeColor(node.id),
    };
  });

  const visEdges = Object.values(network.edges).map(edge => {
    return {
      source: edge.node1Id,
      target: edge.node2Id,
      id: edge.id,
      label: `${edge.node1Id}-${edge.node2Id}`,
      fill: edgeColor(edge.id),
    };
  });


  const handleNodeClick = (node: InternalGraphNode) => {
    console.log(node);
    setText("Node " + node.id + " clicked");
    setSelectedNodeId(node.id);
  };

  const handleEdgeClick = (edge: InternalGraphEdge) => {
    console.log(edge);
    setText("Edge " + edge.id + " clicked");
    setSelectedEdgeId(edge.id);
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
          minNodeSize={nodeSize}
          maxNodeSize={nodeSize}
        />
      </div>
    </>
  );
}
