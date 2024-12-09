import { Node } from "reagraph";
import {EdgeDataRow, EdgeSpectrumDataRow, NodeDataRow} from "./parseCsv";

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

export interface ChannelEdge {
  id: string;
  channel_label: string;
  edges: string[];
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
 * Removes redundant edges
 *
 * since all edges are originally directed and have a corresponding edge going in opposite direction
 * this function change from directed to non directed edges
 * this function chooses id of edge that appears first in the list
 *
 * @param edges - list of edges with redundancies
 * @returns - list of edges without redundancies
 */
export const mergeEdges = (edges: EdgeDataRow[]): EdgeDataRow[] =>{
  const merged: EdgeDataRow[] = []
  edges.map(
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

export const checkEdgeExists = (channelData: EdgeSpectrumDataRow[], edges: EdgeDataRow[]): void => {
  const edgeIDs: string[] = edges.map(element => element.id)
  channelData.forEach(channel => {
    if (!edgeIDs.includes(channel.edgeId)) {
      throw new Error(`Edge does not exists: ${JSON.stringify(channel)} edge id does not appear in EdgeDataRow`);
    }
  })
}

/**
 * Support function for groupByChannel
 * this function reads channel id and checks if that channel has been written into an list
 * if yes - it appends edge id to its list of edges
 * if no - it creates new a Channel with 1 edge and appends it to list of Channels
 *
 * @param channelData - singe EdgeSpectrumDataRow row
 * @param channels - list of all created Channels
 * @returns updated ChannelEdge list
 */
export const getChannel = (channelData: EdgeSpectrumDataRow, channels: ChannelEdge[]): ChannelEdge[] => {
  const cur_label = channelData.channel_label;
  const found = channels.find((channel) => channel.channel_label == cur_label)
  if (found) {
    found.edges.push(channelData.edgeId);
  } else {
    const channel: ChannelEdge = {
      id: channelData.channelId,
      channel_label: channelData.channel_label,
      edges: [channelData.edgeId],
      frequency: channelData.frequency,
      width: channelData.channelWidth
    }
    channels.push(channel)
  }
  return channels
}

/**
 * Reads though parsed csv data and extracts information about channel
 * In EdgeSpectrum data row information is grouped by edge,
 * This function iterates though all rows of EdgeSpectrumDataRow and calls getChannel on all of them
 *
 *
 * @param channelData - all EdgeSpectrumDataRow rows
 * @returns - list of channel objects
 */
export const groupByChannel = (channelData: EdgeSpectrumDataRow[]): ChannelEdge[] => {
  let channel_edges: ChannelEdge[] = [];
  for (const element of channelData) {
    channel_edges = getChannel(element, channel_edges);
  }
  return channel_edges
}

/**
 * Replaces list of edge ids with list of node ids for all Channels
 *
 * @param channelsEdge - list of channels containing list of edges ids they go though
 * @param edges - list of edges in the network, needed to get ids of nodes
 * @returns list of channels containing list of nodes ids they go though
 */
export const getChannelNodes = (channelsEdge: ChannelEdge[], edges: Edge[]): Channel[] => {
  const channels: Channel[] = channelsEdge.map(channelE => {
    const channel: Channel = {
      id: channelE.id,
      width: channelE.width,
      frequency: channelE.frequency,
      channel_label: channelE.channel_label,
      nodes: []
    }

    const channelEdgesRef: string[] = channelE.edges.slice()
    // get list of edges

    const channelEdgesObj = channelEdgesRef.map(edgeID => edges.find(element => element.id == edgeID));
    if (!channelEdgesObj || !channelEdgesObj[0]) {
      throw new Error(`Edge does not exists: ${JSON.stringify(channelE)} edge id does not appear in EdgeDataRow`);
    }
    // add first node's edges and see if next edges connect

    channel.nodes.push(channelEdgesObj[0]!.node1Id)
    channel.nodes.push(channelEdgesObj[0]!.node2Id)

    const max_attempts = channelEdgesObj.length
    let attempts = 0
    channelEdgesObj.shift()
    for (const edge of channelEdgesObj!) {
      if (!edge) {
        throw new Error(`Edge does not exists: ${JSON.stringify(channelE)} edge id does not appear in EdgeDataRow`);
      }
      // check last node in path
      if (edge!.node1Id == channel.nodes.slice(-1)[0]) {
        channel.nodes.push(edge!.node2Id)
        attempts = 0
      } else if (edge!.node2Id == channel.nodes.slice(-1)[0]) {
        channel.nodes.push(edge!.node1Id)
        attempts = 0
      } else if (edge!.node1Id == channel.nodes[0]) {
        channel.nodes.unshift(edge!.node2Id)
        attempts = 0
      } else if (edge!.node2Id == channel.nodes[0]) {
        channel.nodes.unshift(edge!.node1Id)
        attempts = 0
      }
      // if all misses try again
      else {
        attempts += 1
        // if all edges cannot be organized into a path log information
        if (attempts > max_attempts) {
          if(channel.nodes.includes(edge.node1Id) || channel.nodes.includes(edge.node2Id)){
            console.log(`branching edge ${JSON.stringify(edge)} in channel ${JSON.stringify(channel)}`)
          }
          break
        }
        //append to end of queue
        channelEdgesObj.push(edge)
      }
    }
    return channel
  })

  return channels
}


/**
 * Removes rows which ids are not in Edge list
 *
 * Removes redundant edges and their channel info from EdgeSpectrumDataRow list
 * Should be called after MergeEdges
 *
 * @param channelData
 * @param edges - non redundant list of edges
 * @returns - non redundant EdgeSpectrumDataRow list
 */
export const mergeSpectrum = (channelData: EdgeSpectrumDataRow[], edges: Edge[]):EdgeSpectrumDataRow[] =>{
  const channelMerged: EdgeSpectrumDataRow[] = []
  const edgeIDs: string[] = edges.map(element => element.id)
  for (const channel of channelData) {
    if (edgeIDs.includes(channel.edgeId)) {
      channelMerged.push(channel)
    }
  }
  return channelMerged
}

/**
 * Removes nodes without neighbors from the list
 *
 * @param nodes - list of nodes
 * @returns - new list of nodes without isolated nodes
 */
export const removeIsolatedNodes = (nodes: Node[]): Node[] =>{
  const new_nodes: Node[] = [];
  nodes.forEach((node) => {
    if(node.neighbors.length > 0){
      new_nodes.push(node)
    }
  })
  return new_nodes
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], channelData: EdgeSpectrumDataRow[]): Network => {
  // moved for easier testing
  let nodes: Node[] = handleNode(nodesData)

  //check data integrity
  checkEdgeExists(channelData, edgesData)

  // pair directional edges in handle edge
  const edgesMerged = mergeEdges(edgesData);

  const edges = edgesMerged.map((edgeData) => handleEdge(edgeData, nodes));

  nodes = removeIsolatedNodes(nodes)
  const channelsMerged = mergeSpectrum(channelData, edges)

  // temp data - group information into channels
  const channelEdges = groupByChannel(channelsMerged);

  const channels = getChannelNodes(channelEdges, edges);

  return {nodes, edges, channels};
}