import {Node, Channel, Edge, Network} from "./network.ts";
import {ImportedNetwork} from "../DataImporter/buildNetwork.ts";

export const convertToRenderable = (importedNetwork: ImportedNetwork): Network => {
  const {nodes, edges, channels} = importedNetwork;
  const renderableNodes: Record<string, Node> = {};
  const renderableEdges: Record<string, Edge> = {};
  const renderableChannels: Record<string, Channel> = {};

  const getEdges = (nodeIds: string[]): Edge[] => {
    const collectedEdges: Edge[] = []

    for (let i= 0; i < nodeIds.length - 1; i++){
      const firstNodeId = nodeIds[i]
      const secondNodeId = nodeIds[i+1]
      const edge = edges.find((edge) => {return (edge.node1Id == firstNodeId && edge.node2Id == secondNodeId) || (edge.node1Id == secondNodeId && edge.node2Id == firstNodeId)  })
      if (edge){
        collectedEdges.push(edge)
      } else {
        throw new Error(`Invalid node array. Nodes ${firstNodeId} and ${secondNodeId} don't belong to any edge. `)
      }
    }

    return collectedEdges
  }
  nodes.forEach((node) => {
    renderableNodes[node.id] = {
      id: node.id,
      latitude: node.latitude,
      longitude: node.longitude,
      neighbors: node.neighbors.map((neighbor) => neighbor.node.id),
    };
  });

  edges.forEach((edge) => {
    renderableEdges[edge.id] = {
      id: edge.id,
      node1Id: edge.node1Id,
      node2Id: edge.node2Id,
      totalCapacity: edge.totalCapacity,
      provisionedCapacity: edge.provisionedCapacity
    };
  });

  channels.forEach((channel) => {
    renderableChannels[channel.id] = {
      id: channel.id,
      nodes: channel.nodes,
      edges: getEdges(channel.nodes).map((edge) => edge.id),
      frequency: channel.frequency,
      width: channel.width
    };
  });

  return {nodes: renderableNodes, edges: renderableEdges, channels: renderableChannels};
};