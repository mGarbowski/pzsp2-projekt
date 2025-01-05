import {EdgeDataRow, NodeDataRow, parseEdges, parseEdgeSpectrum, parseNodes} from './parseCsv';

describe('CSV Parsers', () => {
  describe('parseNodes', () => {
    it('should parse valid nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const expected: NodeDataRow[] = [
        {id: '1', latitude: 34.05, longitude: -118.25},
        {id: '2', latitude: 40.71, longitude: -74.01},
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
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50},
        {id: '2', node1: '2', node2: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17},
      ];
      expect(parseEdges(csvData)).toEqual(expected);
    });

    it('should throw an error for invalid edges', () => {
      const csvData = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,invalid\n';
      expect(() => parseEdges(csvData)).toThrow('Invalid edge');
    });
  });

  describe('parseEdgeSpectrum', () => {
    it('should parse valid rows, skipping empty ones', () => {
      const csvData = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
        "1,11,195.850000,101.800,1530.72,CH-2\n" +
        "1,12,195.450000,37.5,1533.86,CH-10\n" +
        "2,13,195.650000,59.000,1532.29,CH-6\n" +
        "2,,,,,\n" +
        "2,14,195.250000,37.5,,\n";

      const expected = [
        {edgeId: '1', channelId: '11', frequency: 195.85, channelWidth: 112.5, channel_label: "CH-2"},
        {edgeId: '1', channelId: '12', frequency: 195.45, channelWidth: 50.0, channel_label: "CH-10"},
        {edgeId: '2', channelId: '13', frequency: 195.65, channelWidth: 75.0, channel_label: "CH-6"},
        {edgeId: '2', channelId: '14', frequency: 195.25, channelWidth: 50, channel_label: ""},
      ];

      expect(parseEdgeSpectrum(csvData)).toEqual(expected);
    });
  });
});