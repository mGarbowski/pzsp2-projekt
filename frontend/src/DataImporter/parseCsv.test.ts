import { parseNodes, parseEdges, NodeDataRow, EdgeDataRow } from './parseCsv';

describe('CSV Parsers', () => {
  describe('parseNodes', () => {
    it('should parse valid nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const expected: NodeDataRow[] = [
        { id: '1', latitude: 34.05, longitude: -118.25 },
        { id: '2', latitude: 40.71, longitude: -74.01 },
      ];
      expect(parseNodes(csvData)).toEqual(expected);
    });

    it('should throw an error for invalid nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,invalid,-118.25\n';
      expect(() => parseNodes(csvData)).toThrow('Invalid node');
    });
  });

  describe('parseEdges', () => {
    it('should parse valid edges', () => {
      const csvData = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,50\n2,2,3,4.8 THz,17\n';
      const expected: EdgeDataRow[] = [
        { id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50 },
        { id: '2', node1: '2', node2: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17 },
      ];
      expect(parseEdges(csvData)).toEqual(expected);
    });

    it('should throw an error for invalid edges', () => {
      const csvData = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,invalid\n';
      expect(() => parseEdges(csvData)).toThrow('Invalid edge');
    });
  });
});