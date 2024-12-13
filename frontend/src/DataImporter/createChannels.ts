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
 * Removes rows which ids are not in Edge list
 *
 * Checks if edge id form edgeSpectrumData exists in edges list
 * edgeSpectrumDataRow is removed, if no mach is found
 * Should be called after MergeEdges
 *
 * @param edgeSpectrumData - EdgeSpectrumDataRow list
 * @param edges - non redundant list of edges
 * @returns - non redundant EdgeSpectrumDataRow list
 */
export const mergeSpectrum = (edgeSpectrumData: EdgeSpectrumDataRow[], edges: Edge[]):EdgeSpectrumDataRow[] =>{
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
 * this function reads channel id and checks if that channel has been already created
 * if yes - it appends edge id to its list of edges
 * if no - it creates new a Channel with 1 edge and appends it to the list of Channels
 *
 * @param channelData - singe EdgeSpectrumDataRow row
 * @param channels - list of all created Channels
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
   * Reads though parsed csv data and creates channel objects from it
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
    // get list of edges
    const channelEdges = channelE.edges.map(edgeID => edges.find(element => element.id == edgeID));
    if (!channelEdges) {
      throw new Error(`Edge does not exists: ${JSON.stringify(channelE)} edge id does not appear in EdgeDataRow`);
    }
    // start with first edge
    const nodeList = [channelEdges[0]!.node1Id, channelEdges[0]!.node2Id]
    // ts does not automatically convert Edge||undefined to Edge[] after if(channelEdges)
    channel.nodes = addNodesFormEdges(channelEdges as Edge[] , nodeList)
    return channel
  })

  return channels
}

export const addNodesFormEdges = (edges: Edge[], nodeIdList: string[]): string[] =>{
  const max_attempts = edges.length
  let attempts = 0
  edges.shift()
  for (const edge of edges!) {
    // check last node in path
    const lastNode = nodeIdList[nodeIdList.length - 1];
    const firstNode = nodeIdList[0];

    if ([edge.node1Id, edge.node2Id].includes(lastNode)) {
      nodeIdList.push(edge.node1Id === lastNode ? edge.node2Id : edge.node1Id);
      attempts = 0;
    } else if ([edge.node1Id, edge.node2Id].includes(firstNode)) {
      nodeIdList.unshift(edge.node1Id === firstNode ? edge.node2Id : edge.node1Id);
      attempts = 0;
    }
    // if all misses try again
    else {
      attempts += 1
      // if all edges cannot be organized into a path log information
      if (attempts > max_attempts) {
        break
      }
      //append to end of queue
      edges.push(edge)
    }
  }
  return nodeIdList
}

export const createChannels = (channelData: EdgeSpectrumDataRow[], edges: Edge[]): Channel[]=>{
  // temp data - group information into channels
  channelData = mergeSpectrum(channelData, edges)
  const channelEdges = groupSpectrumByChannel(channelData);

  const channels = getChannelNodes(channelEdges, edges);

  return channels
}