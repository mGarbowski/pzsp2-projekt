import {
  EdgeDataRow,
  EdgeSpectrumDataRow,
  NodeDataRow} from "./parseCsv";
import {
  createChannels
} from "./createChannels"

export interface ImportedEdge {
  id: string;
  node1Id: string;
  node2Id: string;
  totalCapacity: string;
  provisionedCapacity: number;
}

export interface ImportedNode {
  id: string;
  latitude: number;
  longitude: number;
  neighbors: {
    node: ImportedNode;
    edge: ImportedEdge;
  }[];
}

export interface ImportedChannel {
  id: string;
  channel_label: string;
  nodes: string[];
  frequency: number;
  width: number;
}

export interface ImportedNetwork {
  nodes: ImportedNode[];
  edges: ImportedEdge[];
  channels: ImportedChannel[];
}

export const handleEdge = (edgeData: EdgeDataRow, nodes: ImportedNode[]): ImportedEdge => {
  const node1 = nodes.find(node => node.id === edgeData.node1);
  const node2 = nodes.find(node => node.id === edgeData.node2);

  if (!node1 || !node2) {
    throw new Error(`Edge ${edgeData.id} references non-existing nodes`);
  }

  const edge: ImportedEdge = {
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
 * Discard redundant edges from EdgeDataRow list
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
      // find corresponding edge
      const pair = edges.find(element => element.node1 == edge.node2 && element.node2 == edge.node1)
      // check if corresponding edge exists
      if (pair) {
        // check if corresponding edge has been written in merged - if not, push to list - if yes, ignore
        if (!merged.find(element => element.id == pair.id)) {
          merged.push(edge)
        }
      }
    }
  )
  return merged;
}

export const handleNode = (nodesData: NodeDataRow[]): ImportedNode[] => {
  return nodesData.map(nodeData => ({
    id: nodeData.id,
    latitude: nodeData.latitude,
    longitude: nodeData.longitude,
    neighbors: [],
  }));
}

/**
 * Check if all edge ids from edgeSpectrum data row list exists in EdgeDataRow list
 *
 * @param edgeSpectrumsData - unfiltered edgeSpectrumDataRow list
 * @param edgeDataRows - list of edge data rows for spectrum data to be compared against
*/
export const checkIfEdgesExist = (edgeSpectrumsData: EdgeSpectrumDataRow[], edgeDataRows: EdgeDataRow[]): void => {
  const edgeIDs: string[] = edgeDataRows.map(element => element.id)
  edgeSpectrumsData.forEach(spectrumData => {
    if (!edgeIDs.includes(spectrumData.edgeId)) {
      throw new Error(`Edge does not exists: ${JSON.stringify(spectrumData)} edge id does not appear in EdgeDataRow`);
    }
  })
}

/**
 * Remove nodes without neighbors from the list
 *
 * @param nodes - list of nodes
 * @returns - new list without isolated nodes
 */
export const removeIsolatedNodes = (nodes: ImportedNode[]): ImportedNode[] =>{
  return nodes.filter((node) => node.neighbors.length > 0)
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], channelData: EdgeSpectrumDataRow[]): ImportedNetwork => {
  let nodes: ImportedNode[] = handleNode(nodesData)

  //check data integrity
  checkIfEdgesExist(channelData, edgesData)

  // pair directional edges in handle edge
  const dataRowsMerged = discardRedundantEdges(edgesData);

  const edges = dataRowsMerged.map((edgeData) => handleEdge(edgeData, nodes));

  nodes = removeIsolatedNodes(nodes)

  const channels = createChannels(channelData, edges)

  return {nodes, edges, channels};
}