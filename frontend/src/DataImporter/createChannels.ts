import {
  Channel,
  Edge
} from "./buildNetwork";
import {
  EdgeSpectrumDataRow
} from "./parseCsv"

export interface ChannelEdge {
  id: string;
  channel_label: string;
  edges: string[];
  frequency: number;
  width: number;
}


/**
 * Remove rows which ids are not in the edges list
 *
 *
 * Check if each edge from EdgeSpectrumData exists in the edges list
 * An edge is removed from spectrum data if no match is found in edges
 * Should be called after MergeEdges
 *
 * @param edgeSpectrumData - EdgeSpectrumDataRow list
 * @param edges - non-redundant Edge list
 * @returns - non redundant EdgeSpectrumDataRow list
*/
export const removeRedundantSpectrumRows = (edgeSpectrumData: EdgeSpectrumDataRow[], edges: Edge[]):EdgeSpectrumDataRow[] =>{
  const channelMerged: EdgeSpectrumDataRow[] = []
  const edgeIDs: string[] = edges.map(element => element.id)
  for (const channel of edgeSpectrumData) {
    if (edgeIDs.includes(channel.edgeId)) {
      channelMerged.push(channel)
    }
  }
  return channelMerged
}

/**
 * Support function for groupSpectrumByChannel
 * this function reads channel id from EdgeSpectrumDataRow
 * and checks if Channel with that id has already been created
 *
 * if yes - append edge id to its list of edges
 * if no - create new a Channel with 1 edge and append it to the list of Channels
 *
 * @param channelData - single EdgeSpectrumDataRow row
 * @param channels - a list of all created Channels
 * @returns updated ChannelEdge list
*/
export const getChannel = (channelData: EdgeSpectrumDataRow, channels: ChannelEdge[]): ChannelEdge[] => {
  const cur_id = channelData.channelId;
  const found = channels.find((channel) => channel.id == cur_id)
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
 * Reads through parsed csv data and creates channel objects from it
 *
 * @param channelData - all EdgeSpectrumDataRow rows
 * @returns - list of channel objects
*/
export const groupSpectrumByChannel = (channelData: EdgeSpectrumDataRow[]): ChannelEdge[] => {
  let channel_edges: ChannelEdge[] = [];
  for (const element of channelData) {
    channel_edges = getChannel(element, channel_edges);
  }
  return channel_edges
}

/**
 * Replaces a list of edge ids with a list of node ids for a given channel
 *
 * @param channel - ChannelEdge object containing a list of edge ids
 * @param edges - a list of edges in the network, needed to get node ids
 * @returns - a list of Node ids that channel goes though
*/
export const changeChannelEdgesToNodes = (channel: ChannelEdge, edges: Edge[]): string[] =>{
  let channelEdges: Edge[] = []
  try{
    channelEdges = getEdgesFromChannel(channel.edges, edges)
  }
  catch{
    // throw more descriptive error
    throw new Error(`Edge does not exist: ${JSON.stringify(channel)} edge id does not appear in EdgeDataRow`);
  }
  return arrangeEdgesNodesIntoPath(channelEdges)
}

/**
 * Arrange node ids from Edges list into a valid path
 *
 * Function starts with nodes from the first edge in the list.
 * Next, edges are iterated though in a loop
 * Each iteration checks if a node can be added to the path.
 * For that one of the edge`s nodes must be at either end of the path.
 *
 * If no node cannot be added edge is appended to the back of the edges list to be considered again later
 * Appending can be done for maximum of edge list length -1 times.
 * It is so that
 * 1) loop will not end before a maximum length path is arranged
 * 2) loop will not be endless in case of an edge disconnected from the rest
 *
 * @param channelEdges - a list of edges which nodes should be arranged into a path
 * @returns - a list of strings containing node ids arranged into a path
*/
export const arrangeEdgesNodesIntoPath = (channelEdges: Edge[]): string[] =>{
  const max_attempts = channelEdges.length
  let attempts = 0
  const nodeIdList = [channelEdges[0]!.node1Id, channelEdges[0]!.node2Id]
  channelEdges.shift()
  for (const edge of channelEdges) {
    const lastNode = nodeIdList[nodeIdList.length - 1];
    const firstNode = nodeIdList[0];
    if ([edge.node1Id, edge.node2Id].includes(lastNode)) {
      nodeIdList.push(edge.node1Id === lastNode ? edge.node2Id : edge.node1Id);
      attempts = 0;
    } else if ([edge.node1Id, edge.node2Id].includes(firstNode)) {
      nodeIdList.unshift(edge.node1Id === firstNode ? edge.node2Id : edge.node1Id);
      attempts = 0;
    }
    // if nodes cannot be arranged try again
    else {
      attempts += 1
      if (attempts > max_attempts) {
        break
      }
      //append to the end of the queue
      channelEdges.push(edge)
    }
  }
  return nodeIdList
}

/**
 * Retrieve edge objects based on a list of provided ids
 *
 * @param edgeIds - a list of edge ids
 * @param edges - a list of edges in the network, needed to get node ids
 * @returns - a list of Edge objects
*/
export const getEdgesFromChannel = (edgeIds: string[], edges: Edge[]): Edge[] => {
  if(edgeIds.length == 0){
    return []
  }
  // get list of edges
  const channelEdges = edgeIds.map(edgeID => edges.find(element => element.id == edgeID));
  // if edge cannot be found,type script placed undefined in the list
  if (!channelEdges.includes(undefined)) {
    return channelEdges as Edge[]
  }
  throw new Error(`Edge does not exist`)
}

export const createChannels = (channelData: EdgeSpectrumDataRow[], edges: Edge[]): Channel[]=>{
  channelData = removeRedundantSpectrumRows(channelData, edges)
  const channelEdges = groupSpectrumByChannel(channelData);

  const channels: Channel[] = channelEdges.map(channelE => {
    return {
      id: channelE.id,
      width: channelE.width,
      frequency: channelE.frequency,
      channel_label: channelE.channel_label,
      nodes: changeChannelEdgesToNodes(channelE, edges)
    }
  }
  )

  return channels
}