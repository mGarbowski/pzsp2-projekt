import {
  ChannelEdges,
  groupSpectrumByChannel,
  removeRedundantSpectrumRows,
  changeChannelEdgesToNodes
} from "./createChannels"
import {
  EdgeSpectrumDataRow,
  parseEdgeSpectrum
} from "./parseCsv"
import {
  Edge
} from "./buildNetwork"


describe('Channels', () => {
  describe('getChannel', () => {
    it('should create ChannelEdges objects from edgeSpectrumRows', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "1,12,195,50,195,CH-81\n"+
          "2,12,195,50,195,CH-82\n"+
          "3,12,195,50,195,CH-83\n"+
          "4,12,195,50,195,CH-84\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdges[] = [
        {
          id: '12',
          channel_label: "CH-81",
          frequency: 195,
          width: 50,
          edges: ["1", "2", "3", "4"],
        }
      ]
      expect(groupSpectrumByChannel(channelData)).toEqual(expected);
    });

    it('should create 1 channel with 2 edges', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdges[] = [
        {
          id: '6007100605839137070',
          channel_label: "CH-81",
          frequency: 191.900000,
          width: 50.0,
          edges: ["-2242719450019019377", "-1111111111111111111"],
        }
      ]
      expect(groupSpectrumByChannel(channelData)).toEqual(expected);
    });

    it('should create 2 channel with 2 edges each', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-2242719450019019377,1111111111111111111,191.900000,37.5,1562.23,CH-82\n" +
          "-1111111111111111111,1111111111111111111,191.900000,37.5,1562.23,CH-82\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdges[] = [
        {
          id: '6007100605839137070',
          channel_label: "CH-81",
          frequency: 191.900000,
          width: 50.0,
          edges: ["-2242719450019019377", "-1111111111111111111"],
        },
        {
          id: '1111111111111111111',
          channel_label: "CH-82",
          frequency: 191.900000,
          width: 50.0,
          edges: ["-2242719450019019377", "-1111111111111111111"],
        },
      ]
      expect(groupSpectrumByChannel(channelData)).toEqual(expected);
    });
  })
  describe("removeRedundantSpectrumRows", () => {
    it('should remove edge spectrum rows which do not appear in edges list', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10}
      ]

      const expected: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]

      expect(removeRedundantSpectrumRows(channelData, edges)).toEqual(expected)
    })
    it('should not remove spectrum rows of existing edges', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '3', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
        {id: '2', node1Id: '1', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 10}
      ]

      const expected: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '3', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      expect(removeRedundantSpectrumRows(channelData, edges)).toEqual(expected)
    })
  })

  describe("changeChannelEdgesToNodes", () => {
    it("Should return channel with a list of nodes instead of edges", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']}

      const expectedNodes = ['1', '2', '3']
      expect(changeChannelEdgesToNodes(channel, edges)).toEqual(expectedNodes)
    })
    it("Should throw an error if there are no edges in the network", () => {
      const edges: Edge[] = []
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']}
      expect(() => changeChannelEdgesToNodes(channel, edges)).toThrow("Edge does not exist")
    })
    it("should throw an error if channel has a non existent edge", () => {
      const edges: Edge[] = [
        {id: '3', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      ]
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']}
      expect(() => changeChannelEdgesToNodes(channel, edges)).toThrow("Edge does not exist")
    })
    it("Should handle edges with out of order nodes", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '4', node2Id: '5', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2', '3', '4']}

      const expectedNodes=  ['1', '2', '3', '4', '5']
      expect(changeChannelEdgesToNodes(channel, edges)).toEqual(expectedNodes)
    })
    it("Should handle out of order edges", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '4', node2Id: '5', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']}
      const expectedNodes = ['1', '2', '3', '4', '5']
      expect(changeChannelEdgesToNodes(channel, edges)).toEqual(expectedNodes)
    })
    it("Should handle out of order edges 2", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '4', node2Id: '5', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '6', node1Id: '6', node2Id: '7', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '7', node1Id: '8', node2Id: '9', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channel: ChannelEdges = {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']}
      const expectedNodes =['1', '2', '3', '4', '5']
      expect(changeChannelEdgesToNodes(channel, edges)).toEqual(expectedNodes)
    })
    it("Should ignore the edge that can't be connected", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '6', node2Id: '7', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channel: ChannelEdges= {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']}
      const expectedNodes =['1', '2', '3','4']
      expect(changeChannelEdgesToNodes(channel, edges)).toEqual(expectedNodes)
    })
  })
});