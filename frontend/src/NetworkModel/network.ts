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
  neighbors: string[];
}

export interface Channel {
  id: string;
  nodes: string[];
  edges: string[];
  frequency: number;
  width: number;
}

export interface Network {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  channels: Record<string, Channel>;
}