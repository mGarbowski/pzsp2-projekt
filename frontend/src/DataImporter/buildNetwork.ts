import {EdgeDataRow, NodeDataRow, EdgeSpectrumDataRow} from "./parseCsv";

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
  nodes: string[];
  frequency: number;
  width: number;
  // wavelength: number;
}
export interface ChanelEdge {
  id: string;
  chanel_label: string;
  edges: string[];
  frequency: number;
  width: number;
  // wavelength: number;
}

export interface Network {
  nodes: Node[];
  edges: Edge[];
  chanels: Chanel[];
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

export const mergeEdges = (edges: EdgeDataRow[]): EdgeDataRow[] =>{
    let merged: EdgeDataRow[] = []
    edges.map(
      edge => {
        // finding corresponding edge
        const pair = edges.find(element => element.node1 == edge.node2 && element.node2 == edge.node1)
        // check if corresponding edge exists
        if(typeof pair !== 'undefined' ){
          // check if corresponding edge has been written in merged - push if not - ignore if yes
          if(typeof merged.find(element => element.id == pair.id) === 'undefined'){
            merged.push(edge)
          }
        }
        else{
          throw new Error(`Can't merge: ${JSON.stringify(edge)} has no pair`);
        }
      }
    )
    return merged;
}

export const handleNode = (nodesData: NodeDataRow[]): Node[] =>{
  return nodesData.map(nodeData => ({
    id: nodeData.id,
    latitude: nodeData.latitude,
    longitude: nodeData.longitude,
    neighbors: [],
  }));
}

export const checkEdgeExists = (chanelData: EdgeSpectrumDataRow[], edges: EdgeDataRow[]): boolean =>{
  const edgeIDs: string[] = edges.map(element => element.id)
  chanelData.map(chanel => {
    if(!edgeIDs.includes(chanel.edgeId)){
      throw new Error(`Edge does not exists: ${JSON.stringify(chanel)} edge id does not apper in EdgeDataRow`);
    }
  })
  return true
}

function getChanel(chanelData: EdgeSpectrumDataRow, chanels: ChanelEdge[]) {
  const cur_id = chanelData.channelId;
  const found = chanels.find((chanel) => chanel.id == cur_id)
  if(typeof found !== "undefined"){
    found.edges.push(chanelData.edgeId);
  }
  else{
      const chanel: ChanelEdge = {
        id: chanelData.channelId,
        chanel_label: chanelData.chanel_label,
        edges: [chanelData.edgeId],
        frequency: chanelData.frequency,
        width: chanelData.channelWidth
      }
      chanels.push(chanel)
  }
  return chanels
}

export function groupByChanel(chanelData: EdgeSpectrumDataRow[]){
  let chanel_edges: ChanelEdge[] = [];
  for(const element of chanelData){
    chanel_edges = getChanel(element, chanel_edges);
  }
  return chanel_edges
}

export const chanelNode = (chanelsEdge: ChanelEdge[], edges: Edge[]): Chanel[] => {
  const chanels: Chanel[] = chanelsEdge.map(chanelE =>
    {
      const chanel: Chanel = {id: chanelE.id, width: chanelE.width, frequency: chanelE.frequency, chanel_label: chanelE.chanel_label, nodes: []}

      let chanelEdgesRef: string[] = chanelE.edges.slice()
      // get list of edges

      const chanelEdgesObj = chanelEdgesRef.map(edgeID => edges.find(element => element.id == edgeID));
      if(!chanelEdgesObj || !chanelEdgesObj[0]){
        throw new Error(`Edge does not exists: ${JSON.stringify(chanelE)} edge id does not apper in EdgeDataRow`);
      }
      // add first node's edges and see if next edges connect

      chanel.nodes.push(chanelEdgesObj[0]!.node1Id)
      chanel.nodes.push(chanelEdgesObj[0]!.node2Id)

      const max_attempts = chanelEdgesObj.length
      let attempts = 0
      chanelEdgesObj.shift()
      for(const edge of chanelEdgesObj!){
        if(!edge){
          throw new Error(`Edge does not exists: ${JSON.stringify(chanelE)} edge id does not apper in EdgeDataRow`);
        }
        // check last node in path
        if(edge!.node1Id == chanel.nodes.slice(-1)[0] ){
          chanel.nodes.push(edge!.node2Id)
          attempts = 0
        }
        else if(edge!.node2Id == chanel.nodes.slice(-1)[0]){
          chanel.nodes.push(edge!.node1Id)
          attempts = 0
        }
        else if(edge!.node1Id == chanel.nodes[0] ){
          chanel.nodes.unshift(edge!.node2Id)
          attempts = 0
        }
        else if(edge!.node2Id == chanel.nodes[0]){
          chanel.nodes.unshift(edge!.node1Id)
          attempts = 0
        }
        // if all misses try again
        else{
          attempts += 1
          // if all edges cannot be organised into a path thow error
          if(attempts > max_attempts){
            throw new Error(`Disconnected edge: ${JSON.stringify(chanelE)} has a disconnected edge ${JSON.stringify(edge)}`)
          }
          //append to end of queue
          chanelEdgesObj.push(edge)
        }
      }
      return chanel
  })

  return chanels
}

export const mergeSpectrum = (chanelData: EdgeSpectrumDataRow[], edges: Edge[]):EdgeSpectrumDataRow[] =>{
  const chanelMerged: EdgeSpectrumDataRow[] = []
  const edgeIDs: string[] = edges.map(element => element.id)
  for(const chanel of chanelData){
    if(edgeIDs.includes(chanel.edgeId)){
      chanelMerged.push(chanel)
    }
  }
  return chanelMerged
}

export const buildNetwork = (nodesData: NodeDataRow[], edgesData: EdgeDataRow[], chanelData: EdgeSpectrumDataRow[]): Network => {
  // moved for easier testing
  const nodes: Node[] =handleNode(nodesData)

  //check data integrity
  checkEdgeExists(chanelData, edgesData)

  // pair dierctional edges in handle edge
  const edgesMerged = mergeEdges(edgesData);

  const edges = edgesMerged.map((edgeData) => handleEdge(edgeData, nodes));

  const chanelsMerged = mergeSpectrum(chanelData, edges)

// temp data - group information into chanels
  const chanelEdges = groupByChanel(chanelsMerged);

  let chanels = chanelNode(chanelEdges, edges);

  return {nodes, edges, chanels};
}