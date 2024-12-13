import {
  EdgeDataRow,
  EdgeSpectrumDataRow,
  NodeDataRow} from "./parseCsv";
import {
  createChannels
} from "./createChannels"

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

export interface Channel {
  id: string;
  channel_label: string;
  nodes: string[];
  frequency: number;
  width: number;
}



export interface Network {
  nodes: Node[];
  edges: Edge[];
  channels: Channel[];
}

export const handleEdge = (edgeData: EdgeDataRow, nodes: Node[]): Edge => {
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


/**
 * Discards redundant edges from EdgeDataRow list
 *
 * First edge that appears in the EdgeDataRow list is kept from 2 connecting the same nodes
 * If an edge does not have a pair it is treated as invalid and also discarded
 *
 *
 * @param edges - list of edges with redundancies
 * @returns - list of edges without redundancies
 */
export const discardRedundantEdges = (edges: EdgeDataRow[]): EdgeDataRow[] =>{
  const merged: EdgeDataRow[] = []
  edges.forEach(
    edge => {
      // finding corresponding edge
      const pair = edges.find(element => element.node1 == edge.node2 && element.node2 == edge.node1)
      // check if corresponding edge exists
      if (pair) {
        // check if corresponding edge has been written in merged - push if not - ignore if yes
        if (!merged.find(element => element.id == pair.id)) {
          merged.push(edge)
        }
      }
    }
  )
  return merged;
}

export const handleNode = (nodesData: NodeDataRow[]): Node[] => {
  return nodesData.map(nodeData => ({
    id: nodeData.id,
    latitude: nodeData.latitude,
    longitude: nodeData.longitude,
    neighbors: [],
  }));
}

/**
 * Checks if edge id from edgeSpectrum data row exists in EdgeDataRow
 *
 * @param edgeSpectrumData - unfiltered edgeSpectrumDataRow list
 * @param edgeDataRows
 */
export const checkIfEdgeExists = (edgeSpectrumData: EdgeSpectrumDataRow[], edgeDataRows: EdgeDataRow[]): void => {
  const edgeIDs: string[] = edgeDataRows.map(element => element.id)
  edgeSpectrumData.forEach(spectrumData => {
    if (!edgeIDs.includes(spectrumData.edgeId)) {
      throw new Error(`Edge does not exists: ${JSON.stringify(spectrumData)} edge id does not appear in EdgeDataRow`);
    }
  })
}

/**
 * Removes nodes without neighbors from the list
 *
 * @param nodes - list of nodes
 * @returns - new list without isolated nodes
 */
export const removeIsolatedNodes = (nodes: Node[]): Node[] =>{
  const new_nodes: Node[] = nodes.filter((node) => node.neighbors.length > 0)
  return new_nodes
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], channelData: EdgeSpectrumDataRow[]): Network => {
  // moved for easier testing
  let nodes: Node[] = handleNode(nodesData)

  //check data integrity
  checkIfEdgeExists(channelData, edgesData)

  // pair directional edges in handle edge
  const edgesMerged = discardRedundantEdges(edgesData);

  const edges = edgesMerged.map((edgeData) => handleEdge(edgeData, nodes));

  nodes = removeIsolatedNodes(nodes)

  const channels = createChannels(channelData, edges)

  return {nodes, edges, channels};
}