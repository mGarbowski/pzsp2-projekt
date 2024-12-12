import { Network, Node, Edge, Channel } from './network';

const nodes: Record<string, Node> = {
  'N1': { id: 'N1', latitude: 52.2297, longitude: 21.0122, neighbors: ['N2', 'N4', 'N6', 'N9'] }, // Warsaw
  'N2': { id: 'N2', latitude: 50.0647, longitude: 19.9450, neighbors: ['N1', 'N3', 'N5', 'N7'] }, // Krakow
  'N3': { id: 'N3', latitude: 51.1079, longitude: 17.0385, neighbors: ['N2', 'N4', 'N5'] }, // Wroclaw
  'N4': { id: 'N4', latitude: 51.7592, longitude: 19.4560, neighbors: ['N1', 'N3', 'N5'] }, // Lodz
  'N5': { id: 'N5', latitude: 50.2649, longitude: 19.0238, neighbors: ['N2', 'N3', 'N4', 'N6'] }, // Katowice
  'N6': { id: 'N6', latitude: 53.1325, longitude: 23.1688, neighbors: ['N1', 'N5', 'N7'] }, // Bialystok
  'N7': { id: 'N7', latitude: 50.0413, longitude: 21.9990, neighbors: ['N6', 'N8'] }, // Rzeszow
  'N8': { id: 'N8', latitude: 53.4285, longitude: 14.5528, neighbors: ['N7', 'N9'] }, // Szczecin
  'N9': { id: 'N9', latitude: 54.3520, longitude: 18.6466, neighbors: ['N1', 'N8'] }, // Gdansk
};

const edges: Record<string, Edge> = {
  'E1': { id: 'E1', node1Id: 'N1', node2Id: 'N2', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E2': { id: 'E2', node1Id: 'N1', node2Id: 'N4', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E3': { id: 'E3', node1Id: 'N1', node2Id: 'N6', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E4': { id: 'E4', node1Id: 'N1', node2Id: 'N9', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E5': { id: 'E5', node1Id: 'N2', node2Id: 'N3', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E6': { id: 'E6', node1Id: 'N2', node2Id: 'N5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E7': { id: 'E7', node1Id: 'N2', node2Id: 'N7', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E8': { id: 'E8', node1Id: 'N3', node2Id: 'N4', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E9': { id: 'E9', node1Id: 'N3', node2Id: 'N5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E10': { id: 'E10', node1Id: 'N4', node2Id: 'N5', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E11': { id: 'E11', node1Id: 'N5', node2Id: 'N6', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E12': { id: 'E12', node1Id: 'N6', node2Id: 'N7', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E13': { id: 'E13', node1Id: 'N7', node2Id: 'N8', totalCapacity: '100Gbps', provisionedCapacity: 50 },
  'E14': { id: 'E14', node1Id: 'N8', node2Id: 'N9', totalCapacity: '100Gbps', provisionedCapacity: 50 },
};

const channels: Record<string, Channel> = {
  'C1': { id: 'C1', nodes: ['N9', 'N1', 'N4', 'N3'], edges: ['E4', 'E2', 'E8'], frequency: 195.45, width: 50.0 }, // Gdansk-Warsaw-Lodz-Wroclaw
  'C2': { id: 'C2', nodes: ['N6', 'N1', 'N4', 'N5'], edges: ['E3', 'E2', 'E10'], frequency: 195.3, width: 75.0 }, // Bialystok-Warsaw-Lodz-Katowice
};

export const demoNetwork: Network = {
  nodes,
  edges,
  channels,
};

