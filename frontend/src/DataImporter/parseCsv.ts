export interface NodeDataRow {
  id: string;
  latitude: number;
  longitude: number;
}

export interface EdgeDataRow {
  id: string;
  node1: string;
  node2: string;
  totalCapacity: string;
  /**
   * Percentage of total capacity
   */
  provisionedCapacity: number;
}

export interface EdgeSpectrumDataRow {
  edgeId: string;
  channelId: string;
  frequency: number;
  channelWidth: number;
  channelLabel: string;
}

const isNodeValid = (node: NodeDataRow): boolean => {
  return node.id !== '' && !isNaN(node.latitude) && !isNaN(node.longitude);
}

const isEdgeValid = (edge: EdgeDataRow): boolean => {
  return edge.id !== '' && edge.node1 !== '' && edge.node2 !== '' && !isNaN(edge.provisionedCapacity);
}

const parseCsv = (data: string): string[][] => {
  return data.split('\n')
    .map(line => line.split(','))
    .filter(line => line.length > 1)
    .slice(1); // skip header
}

export const parseNodes = (data: string): NodeDataRow[] => {
  const lines = parseCsv(data);

  return lines.map(([id, latitude, longitude]) => {
    const node = {id, latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
    if (!isNodeValid(node)) {
      throw new Error(`Invalid node: ${JSON.stringify(node)}`);
    }
    return node;
  });

}

export const parseEdges = (data: string): EdgeDataRow[] => {
  const lines = parseCsv(data);
  return lines.map(([id, node1, node2, totalCapacity, provisionedCapacity]) => {
    const edge = {id, node1, node2, totalCapacity, provisionedCapacity: parseFloat(provisionedCapacity)};
    if (!isEdgeValid(edge)) {
      throw new Error(`Invalid edge: ${JSON.stringify(edge)}`);
    }
    return edge;
  });
}

export const parseEdgeSpectrum = (data: string): EdgeSpectrumDataRow[] => {
  const lines = parseCsv(data);
  return lines.map(([edgeId, channelId, frequency, channelWidth, _,  channelLabel]) => {
    if (edgeId === '' || channelId === '' || frequency === '' || channelWidth === '' || channelLabel === '') {
      return null;
    }
    return {edgeId, channelId, frequency: parseFloat(frequency), channelWidth: parseFloat(channelWidth), channelLabel};
  }).filter(row => row !== null) as EdgeSpectrumDataRow[];
}