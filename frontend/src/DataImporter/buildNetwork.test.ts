import {
  buildNetwork,
  Channel,
  ChannelEdge,
  checkEdgeExists,
  Edge,
  getChannelNodes,
  groupByChannel,
  handleEdge,
  handleNode,
  mergeEdges,
  mergeSpectrum,
  Network,
  Node,
  removeIsolatedNodes
} from "./buildNetwork";
import {EdgeDataRow, EdgeSpectrumDataRow, NodeDataRow, parseEdges, parseEdgeSpectrum, parseNodes} from "./parseCsv";


describe('Nodes', () => {
  describe('handleNode', () => {
    it('should create 1 node', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n';
      const parsed = parseNodes(csvData);
      const expected: Node[] = [
        {id: '1', latitude: 34.05, longitude: -118.25, neighbors: [],}
      ]

      expect(handleNode(parsed)).toEqual(expected)
    })

    it('should create 2 nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed = parseNodes(csvData);
      const expected: Node[] = [
        {id: '1', latitude: 34.05, longitude: -118.25, neighbors: [],},
        {id: '2', latitude: 40.71, longitude: -74.01, neighbors: [],}
      ]
      expect(handleNode(parsed)).toEqual(expected)
    })
  })
  describe("remove isolated nodes",()=>{
    it("should remove modes without neighbors from list", () =>{
      const edge: Edge = {id:'1', node1Id:'1', node2Id:'3', totalCapacity:"4.8Thz", provisionedCapacity:10}
      const nodes: Node[] = [
        {id: '1', latitude: 34.05, longitude: -118.25, neighbors: [],},
        {id: '2', latitude: 40.71, longitude: -74.01, neighbors: [],},
        {id: '3', latitude: 12.71, longitude: -60.01, neighbors: [],}
      ]
      nodes[0].neighbors.push({node: nodes[2] , edge})
      nodes[2].neighbors.push({node: nodes[1] , edge})
      const expected: Node[] = []
      expected.push(nodes[0])
      expected.push(nodes[2])

      expect(removeIsolatedNodes(nodes)).toEqual(expected)
    })
  })
});

describe("Edges", () => {
  describe("handleEdge", () => {
    it("should create edge and update neighbor", () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed = parseNodes(csvData);
      const nodes = handleNode(parsed)

      const csvData_e = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,50';
      const parsed_e = parseEdges(csvData_e)

      const edge_e: Edge = {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      const node_1_e: Node = {id: '1', latitude: 34.05, longitude: -118.25, neighbors: [],}
      const node_2_e: Node = {id: '2', latitude: 40.71, longitude: -74.01, neighbors: [],}

      node_1_e.neighbors.push({node: node_2_e, edge: edge_e})
      node_2_e.neighbors.push({node: node_1_e, edge: edge_e})

      const expected_nodes: Node[] = [node_1_e, node_2_e,]

      expect(handleEdge(parsed_e[0], nodes)).toEqual(edge_e)
      expect(nodes).toEqual(expected_nodes)
    })
  })
  describe("mergeEdges", () => {
    it('should merge edges with same nodes', () => {
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '2', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      const expected: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(mergeEdges(edges)).toEqual(expected)
    })
    it("should discard edges that can't be merged", () => {
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(mergeEdges(edges)).toEqual([])

      const edges_2: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '2', node1: '3', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '3', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
      ]

      const expected: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
      ]

      expect(mergeEdges(edges_2)).toEqual(expected)
    })
    it('should merge edges form more complicated input', () => {
      const edges: EdgeDataRow[] = [
        {id: '-160181617838685002', node1: '30990', node2: '39925', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '-1924338652343423293', node1: '70080', node2: '60168', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '-2017457964338917446', node1: '60168', node2: '70080', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '-2188716338357475633', node1: '24246', node2: '40990', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
        {id: '-8373146988370601128', node1: '39925', node2: '30990', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '-4373598137077956487', node1: '40990', node2: '24246', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
      ]

      const expected: EdgeDataRow[] = [
        {id: '-160181617838685002', node1: '30990', node2: '39925', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        {id: '-1924338652343423293', node1: '70080', node2: '60168', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        {id: '-2188716338357475633', node1: '24246', node2: '40990', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
      ]

      expect(mergeEdges(edges)).toEqual(expected)
    })
  })
});

describe('Channels', () => {
  describe('getChannel', () => {
    it('should convert edge first into channel first', () => {
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
  describe("CheckEdgeExists", () => {
    it('should return if all edges exist', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
        {id: '2', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 10}
      ]

      expect(() => checkEdgeExists(channelData, edges)).not.toThrow()
    })
    it('should throw an exception if EdgeSpectrum refers to non existent edge', () => {
      const channelData: EdgeSpectrumDataRow[] = [
        {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
        {edgeId: '2', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
      ]
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
      ]

      expect(() => checkEdgeExists(channelData, edges)).toThrow("Edge does not exists")
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

describe("Build Network", () => {
  describe("Simple data", () => {
    const edges: EdgeDataRow[] = [
      {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      {id: '2', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
    ]
    const nodes: NodeDataRow[] = [
      {id: '1', latitude: 54.40027054, longitude: 18.58406944},
      {id: '2', latitude: 54.3593940734863, longitude: 18.645393371582},
    ]
    it("should merge edges before adding neighbors to nodes", () => {
      const expectedEdges: Edge[] = [
        {id: '1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      ]

      const expectedNode1: Node = {id: '1', latitude: 54.40027054, longitude: 18.58406944, neighbors: []}
      const expectedNode2: Node = {id: '2', latitude: 54.3593940734863, longitude: 18.645393371582, neighbors: []}
      expectedNode1.neighbors.push({node: expectedNode2, edge: expectedEdges[0]})
      expectedNode2.neighbors.push({node: expectedNode1, edge: expectedEdges[0]})
      const expectedNodes: Node[] = [expectedNode1, expectedNode2]

      const channelData: EdgeSpectrumDataRow[] = []

      const network: Network = buildNetwork(nodes, edges, channelData)
      expect(network.nodes).toEqual(expectedNodes)
      expect(network.edges).toEqual(expectedEdges)

    })
  })
});