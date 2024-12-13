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

/*
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


export const createChannels = (channelData: EdgeSpectrumDataRow[], edges: Edge[]): Channel[]=>{
  // temp data - group information into channels
  channelData = mergeSpectrum(channelData, edges)
  const channelEdges = groupByChannel(channelData);

  const channels = getChannelNodes(channelEdges, edges);

  return channels
}