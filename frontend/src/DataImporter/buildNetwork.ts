import {EdgeDataRow, NodeDataRow, EdgeSpectrumDataRow} from "./parseCsv.ts";

export interface Edge {
  id: string;
  node1Id: string;
  node2Id: string;
  totalCapacity: string;
  provisionedCapacity: number;
}

export interface Node {
  id: string;
  latitude: number;
  longitude: number;
  neighbors: {
    node: Node;
    edge: Edge;
  }[];
}

export interface Chanel {
  id: string;
  chanel_label: string;
  nodes: Node[];
  frequency: number;
  width: number;
  // wavelength: number;
}

export interface Network {
  nodes: Node[];
  edges: Edge[];
}

const handleEdge = (edgeData: EdgeDataRow, nodes: Node[]): Edge => {
  const node1 = nodes.find(node => node.id === edgeData.node1);
  const node2 = nodes.find(node => node.id === edgeData.node2);

  if (!node1 || !node2) {
    throw new Error(`Edge ${edgeData.id} references non-existing nodes`);
  }

  const edge: Edge = {
    id: edgeData.id,
    node1Id: node1.id,
    node2Id: node2.id,
    totalCapacity: edgeData.totalCapacity,
    provisionedCapacity: edgeData.provisionedCapacity,
  };

  node1.neighbors.push({node: node2, edge});
  node2.neighbors.push({node: node1, edge});

  return edge;
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], chanelData: EdgeSpectrumDataRow[]): Network => {
  const nodes: Node[] = nodesData.map(nodeData => ({
    id: nodeData.id,
    latitude: nodeData.latitude,
    longitude: nodeData.longitude,
    neighbors: [],
  }));

  const edges = edgesData.map((edgeData) => handleEdge(edgeData, nodes));

  const chanels: Chanel[] = chanelData.map(chanelData => ({
    id: chanelData.channelId,
    chanel_label: chanelData.chanel_label,
    frequency: chanelData.frequency,
    width: chanelData.channelWidth,
    nodes: []
  }));

  return {nodes, edges, chanels};
}