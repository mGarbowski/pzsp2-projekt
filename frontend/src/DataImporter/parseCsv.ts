interface Node {
  id: string;
  latitude: number;
  longitude: number;
}

interface Edge {
  id: string;
  node1: string;
  node2: string;
  totalCapacity: string;
  /**
   * Percentage of total capacity
   */
  provisionedCapacity: number;
}

const isNodeValid = (node: Node): boolean => {
  return node.id !== '' && !isNaN(node.latitude) && !isNaN(node.longitude);
}

const isEdgeValid = (edge: Edge): boolean => {
  return edge.id !== '' && edge.node1 !== '' && edge.node2 !== '' && !isNaN(edge.provisionedCapacity);
}

const parseCsv = (data: string): string[][] => {
  return data.split('\n')
    .map(line => line.split(','))
    .filter(line => line.length > 1)
    .slice(1); // skip header
}

export const parseNodes = (data: string): Node[] => {
  const lines = parseCsv(data);

  return lines.map(([id, latitude, longitude]) => {
    const node = {id, latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
    if (!isNodeValid(node)) {
      throw new Error(`Invalid node: ${JSON.stringify(node)}`);
    }
    return node;
  });

}

export const parseEdges = (data: string): Edge[] => {
  const lines = parseCsv(data);
  return lines.map(([id, node1, node2, totalCapacity, provisionedCapacity]) => {
    const edge = {id, node1, node2, totalCapacity, provisionedCapacity: parseFloat(provisionedCapacity)};
    if (!isEdgeValid(edge)) {
      throw new Error(`Invalid edge: ${JSON.stringify(edge)}`);
    }
    return edge;
  });
}