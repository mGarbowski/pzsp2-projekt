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
  // forecah chanel
  // look for node that does not appear in any other edge
  // append it and second node to list
  // pop edge from chanel list
  // look for next node in remaining edges

  const chanels: Chanel[] = chanelsEdge.map(chanelE =>{
    const chanel: Chanel = {id: chanelE.id, width: chanelE.width, frequency: chanelE.frequency, chanel_label: chanelE.chanel_label, nodes: []}


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