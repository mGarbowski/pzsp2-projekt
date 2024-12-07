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
  // wavelength: number;
}

export interface ChannelEdge {
  id: string;
  channel_label: string;
  edges: string[];
  frequency: number;
  width: number;
  // wavelength: number;
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

export const mergeEdges = (edges: EdgeDataRow[]): EdgeDataRow[] => {
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
      } else {
        throw new Error(`Can't merge: ${JSON.stringify(edge)} has no pair`);
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

export const groupByChannel = (channelData: EdgeSpectrumDataRow[]): ChannelEdge[] => {
  let channel_edges: ChannelEdge[] = [];
  for (const element of channelData) {
    channel_edges = getChannel(element, channel_edges);
  }
  return channel_edges
}

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
        // if all edges cannot be organized into a path throw error
        if (attempts > max_attempts) {
          throw new Error(`Disconnected edge: ${JSON.stringify(channelE)} has a disconnected edge ${JSON.stringify(edge)}`)
        }
        //append to end of queue
        channelEdgesObj.push(edge)
      }
    }
    return channel
  })

  return channels
}

export const mergeSpectrum = (channelData: EdgeSpectrumDataRow[], edges: Edge[]): EdgeSpectrumDataRow[] => {
  const channelMerged: EdgeSpectrumDataRow[] = []
  const edgeIDs: string[] = edges.map(element => element.id)
  for (const channel of channelData) {
    if (edgeIDs.includes(channel.edgeId)) {
      channelMerged.push(channel)
    }
  }
  return channelMerged
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], channelData: EdgeSpectrumDataRow[]): Network => {
  // moved for easier testing
  const nodes: Node[] = handleNode(nodesData)

  //check data integrity
  checkEdgeExists(channelData, edgesData)

  // pair directional edges in handle edge
  const edgesMerged = mergeEdges(edgesData);

  const edges = edgesMerged.map((edgeData) => handleEdge(edgeData, nodes));

  const channelsMerged = mergeSpectrum(channelData, edges)

  // temp data - group information into channels
  const channelEdges = groupByChannel(channelsMerged);

  const channels = getChannelNodes(channelEdges, edges);

  return {nodes, edges, channels};
}