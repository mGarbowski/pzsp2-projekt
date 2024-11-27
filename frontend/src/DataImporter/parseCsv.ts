interface Node {
  id: string;
  latitude: number;
  longitude: number;
}

const verifyNode = (node: Node): boolean => {
  return node.id !== '' && !isNaN(node.latitude) && !isNaN(node.longitude);
}

export const parseNodes = (data: string): Node[] => {
  const lines = data.split('\n');
  const nodes: Node[] = [];

  for (const line of lines.slice(1)) {
    const [id, latitude, longitude] = line.split(',');
    const node = { id, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    if (verifyNode(node)) {
      nodes.push(node);
    }
  }
  return nodes;
}