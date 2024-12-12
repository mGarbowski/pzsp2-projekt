import { Network, Node, Edge, Channel } from './network';

const nodes: Record<string, Node> = {
  '1': { id: '1', latitude: 52.2297, longitude: 21.0122, neighbors: ['2', '4', '6', '9'] }, // Warsaw
  '2': { id: '2', latitude: 50.0647, longitude: 19.9450, neighbors: ['1', '3', '5', '7'] }, // Krakow
  '3': { id: '3', latitude: 51.1079, longitude: 17.0385, neighbors: ['2', '4', '5'] }, // Wroclaw
  '4': { id: '4', latitude: 51.7592, longitude: 19.4560, neighbors: ['1', '3', '5'] }, // Lodz
  '5': { id: '5', latitude: 50.2649, longitude: 19.0238, neighbors: ['2', '3', '4', '6'] }, // Katowice
  '6': { id: '6', latitude: 53.1325, longitude: 23.1688, neighbors: ['1', '5', '7'] }, // Bialystok
  '7': { id: '7', latitude: 50.0413, longitude: 21.9990, neighbors: ['6', '8'] }, // Rzeszow
  '8': { id: '8', latitude: 53.4285, longitude: 14.5528, neighbors: ['7', '9'] }, // Szczecin
  '9': { id: '9', latitude: 54.3520, longitude: 18.6466, neighbors: ['1', '8'] }, // Gdansk
};

const edges: Record<string, Edge> = {
  '1': { id: '1', node1Id: '1', node2Id: '2', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '2': { id: '2', node1Id: '1', node2Id: '4', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '3': { id: '3', node1Id: '1', node2Id: '6', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '4': { id: '4', node1Id: '1', node2Id: '9', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '5': { id: '5', node1Id: '2', node2Id: '3', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '6': { id: '6', node1Id: '2', node2Id: '5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '7': { id: '7', node1Id: '2', node2Id: '7', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '8': { id: '8', node1Id: '3', node2Id: '4', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '9': { id: '9', node1Id: '3', node2Id: '5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '10': { id: '10', node1Id: '4', node2Id: '5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '11': { id: '11', node1Id: '5', node2Id: '6', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '12': { id: '12', node1Id: '6', node2Id: '7', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '13': { id: '13', node1Id: '7', node2Id: '8', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  '14': { id: '14', node1Id: '8', node2Id: '9', totalCapacity: '100Gbps', provisionedCapacity: 50 },
};

const channels: Record<string, Channel> = {
  '1': { id: '1', nodes: ['9', '1', '4', '3'], edges: ['4', '2', '8'], frequency: 195.45, width: 50.0 }, // Gdansk-Warsaw-Lodz-Wroclaw
  '2': { id: '2', nodes: ['6', '1', '4', '5'], edges: ['3', '2', '10'], frequency: 195.3, width: 75.0 }, // Bialystok-Warsaw-Lodz-Katowice
};

export const demoNetwork: Network = {
  nodes,
  edges,
  channels,
};

