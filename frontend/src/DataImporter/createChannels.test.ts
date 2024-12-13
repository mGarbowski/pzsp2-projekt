import {
  ChannelEdge,
  groupByChannel,
  mergeSpectrum,
  getChannelNodes
} from "./createChannels"
import {
  EdgeSpectrumDataRow,
  parseEdgeSpectrum
} from "./parseCsv"
import {
  Channel,
  Edge
} from "./buildNetwork"


describe('Channels', () => {
  describe('getChannel', () => {
    it('should group data edgeSpectrumRows by photonic service id into Channel objects ', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "1,12,195,50,195,CH-81\n"+
          "2,12,195,50,195,CH-82\n"+
          "3,12,195,50,195,CH-83\n"+
          "4,12,195,50,195,CH-84\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdge[] = [
        {
          id: '12',
          channel_label: "CH-81",
          frequency: 195,
          width: 50,
          edges: ["1", "2", "3", "4"],
        }
      ]
      expect(groupByChannel(channelData)).toEqual(expected);
    });

    it('should group data to 1 channel with 2 edges', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdge[] = [
        {
          id: '6007100605839137070',
          channel_label: "CH-81",
          frequency: 191.900000,
          width: 50.0,
          edges: ["-2242719450019019377", "-1111111111111111111"],
        }
      ]
      expect(groupByChannel(channelData)).toEqual(expected);
    });

    it('should group data to 2 channel with 2 edges each', () => {
      const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +
          "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n" +
          "-2242719450019019377,1111111111111111111,191.900000,37.5,1562.23,CH-82\n" +
          "-1111111111111111111,1111111111111111111,191.900000,37.5,1562.23,CH-82\n";
      const channelData = parseEdgeSpectrum(EdgeSpectrum);
      const expected: ChannelEdge[] = [
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
      expect(groupByChannel(channelData)).toEqual(expected);
    });
  })
  describe("mergeSpectrum", () => {
    it('should merge edge spectrum rows', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10}
      ]

      const expected: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]

      expect(mergeSpectrum(channelData, edges)).toEqual(expected)
    })
    it('should not merge spectrum form different channels', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '1', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-2"}
      ]
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10}
      ]

      const expected: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '1', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-2"}
      ]

      expect(mergeSpectrum(channelData, edges)).toEqual(expected)
    })
    it('should not merge spectrum from different edges', () => {
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
      expect(mergeSpectrum(channelData, edges)).toEqual(expected)
    })
  })

  describe("getChannelNodes", () => {
    it("Should return list of channels with nodes instead of edges", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']},
      ]

      const expectedChannel: Channel[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, nodes: ['1', '2', '3']}
      ]
      expect(getChannelNodes(channels, edges)).toEqual(expectedChannel)
    })
    it("Should throw an error if there are no edges", () => {
      const edges: Edge[] = []
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']},
      ]
      expect(() => getChannelNodes(channels, edges)).toThrow("Edge does not exists")
    })
    it("should throw an error if channel has non existent edge", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      ]
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2']},
      ]
      expect(() => getChannelNodes(channels, edges)).toThrow("Edge does not exists")
    })
    it("Should handle edges with out of order nodes", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '4', node2Id: '5', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['1', '2', '3', '4']},
      ]

      const expectedChannel: Channel[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, nodes: ['1', '2', '3', '4', '5']}
      ]
      expect(getChannelNodes(channels, edges)).toEqual(expectedChannel)
    })
    it("Should handle out of order edges", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '4', node2Id: '5', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']},
      ]
      const expectedChannel: Channel[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, nodes: ['1', '2', '3', '4', '5']}
      ]
      expect(getChannelNodes(channels, edges)).toEqual(expectedChannel)
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
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']},
      ]
      const expectedChannel: Channel[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, nodes: ['1', '2', '3', '4', '5']}
      ]
      expect(getChannelNodes(channels, edges)).toEqual(expectedChannel)
    })
    it("Should ignore edge that can't be connected", () => {
      const edges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '2', node1Id: '2', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '3', node1Id: '3', node2Id: '4', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '4', node1Id: '6', node2Id: '7', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
      ]
      const channels: ChannelEdge[] = [
        {id: '1', channel_label: 'CH-1', width: 50, frequency: 195, edges: ['2', '1', '4', '3']},
      ]
      const expected: Channel[] = [{id: '1', channel_label: 'CH-1', width: 50, frequency: 195, nodes: ['1', '2', '3','4']}]
      expect(getChannelNodes(channels, edges)).toEqual(expected)
    })
    //     it("should handle real channels", () =>{
    //       const cannel_csv = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n" +

  })
});