import { Edge, Node, ChanelEdge, buildNetwork, groupByChanel, handleNode, handleEdge, mergeEdges, Network, Chanel, mergeSpectrum } from "./buildNetwork";
import { EdgeDataRow, NodeDataRow, EdgeSpectrumDataRow ,parseEdges, parseEdgeSpectrum , parseNodes} from "./parseCsv";


describe('Nodes', () =>{
  describe('handeNode', () =>{
    it('should create 1 node', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n';
      const parsed  = parseNodes(csvData);
      const expected: Node[] = [
        { id: '1', latitude: 34.05, longitude: -118.25, neighbors:  [],}
    ]

      expect(handleNode(parsed)).toEqual(expected)
    })

    it('should create 2 nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed  = parseNodes(csvData);
      const expected: Node[] = [
        { id: '1', latitude: 34.05, longitude: -118.25, neighbors:  [],},
        { id: '2', latitude: 40.71, longitude: -74.01, neighbors:  [],}
    ]
    expect(handleNode(parsed)).toEqual(expected)
    })
  })
});

describe("Edges", () =>{
  describe("handleEdge", () =>{
    it("should create edge and update neighbours", ()=>{
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed  = parseNodes(csvData);
      const nodes = handleNode(parsed)

      const csvData_e = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,50';
      const parsed_e = parseEdges(csvData_e)

      const edge_e: Edge = { id: '1', node1Id: '1', node2Id:'2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      const node_1_e: Node = { id: '1', latitude: 34.05, longitude: -118.25, neighbors:  [],}
      const node_2_e: Node = { id: '2', latitude: 40.71, longitude: -74.01, neighbors:  [],}

      node_1_e.neighbors.push({node: node_2_e, edge: edge_e})
      node_2_e.neighbors.push({node: node_1_e, edge: edge_e})

      const expexted_nodes: Node[] = [ node_1_e, node_2_e,]

      expect(handleEdge(parsed_e[0], nodes)).toEqual(edge_e)
      expect(nodes).toEqual(expexted_nodes)
    })
  })
  describe("mergeEdges", () =>{
    it('should merge edges with same nodes', () =>{
      const edges: EdgeDataRow[] = [
        { id: '1', node1: '1', node2:'2', totalCapacity: '4.8 THz',  provisionedCapacity: 50,},
        { id: '2', node1: '2', node2:'1', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      const expected: EdgeDataRow[] = [
        { id: '1', node1: '1', node2:'2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(mergeEdges(edges)).toEqual(expected)
    })
    it("should throw an exception when edge can't be merged", () =>{
      const edges: EdgeDataRow[] = [
        { id: '1', node1: '1', node2:'2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(() => mergeEdges(edges)).toThrow("Can't merge")

      const edges_2 : EdgeDataRow[] = [
        { id: '1', node1: '1', node2:'2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        { id: '2', node1: '3', node2:'1', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(() => mergeEdges(edges_2)).toThrow("Can't merge")
    })
    it('should merge edges form more complicated input', () =>{
      const edges: EdgeDataRow[] = [
        { id: '-160181617838685002', node1: '30990', node2:'39925', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        { id: '-1924338652343423293', node1: '70080', node2:'60168', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        { id: '-2017457964338917446', node1: '60168', node2:'70080', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        { id: '-2188716338357475633', node1: '24246', node2:'40990', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
        { id: '-8373146988370601128', node1: '39925', node2:'30990', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        { id: '-4373598137077956487', node1: '40990', node2:'24246', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
      ]

      const expected: EdgeDataRow[] = [
        { id: '-160181617838685002', node1: '30990', node2:'39925', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
        { id: '-1924338652343423293', node1: '70080', node2:'60168', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
        { id: '-2188716338357475633', node1: '24246', node2:'40990', totalCapacity: '4.8 THz', provisionedCapacity: 11,},
      ]

      expect(mergeEdges(edges)).toEqual(expected)
    })
  })
});

describe('GroupChannels', () => {
    describe('getChannel', () => {
      it('should convert edge first into channel first', () => {
        const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n"+
        "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n";
        const chanelDtata = parseEdgeSpectrum(EdgeSpectrum);
        const expected: ChanelEdge[] = [
            { id: '6007100605839137070', chanel_label: "CH-81", frequency: 191.900000, width: 50.0, edges: ["-2242719450019019377"],}
        ]
        expect(groupByChanel(chanelDtata)).toEqual(expected);
      });

      it('should group data to 1 chanel with 2 edges', () => {
        const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n"+
        "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n"+
        "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n";
        const chanelDtata = parseEdgeSpectrum(EdgeSpectrum);
        const expected: ChanelEdge[] = [
            { id: '6007100605839137070', chanel_label: "CH-81", frequency: 191.900000, width: 50.0, edges: ["-2242719450019019377", "-1111111111111111111"],}
        ]
        expect(groupByChanel(chanelDtata)).toEqual(expected);
      });

      it('should group data to 2 chanel with 2 edges each', () => {
        const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n"+
        "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n"+
        "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n"+
        "-2242719450019019377,1111111111111111111,191.900000,37.5,1562.23,CH-82\n"+
        "-1111111111111111111,1111111111111111111,191.900000,37.5,1562.23,CH-82\n";
        const chanelDtata = parseEdgeSpectrum(EdgeSpectrum);
        const expected: ChanelEdge[] = [
            { id: '6007100605839137070', chanel_label: "CH-81", frequency: 191.900000, width: 50.0, edges: ["-2242719450019019377", "-1111111111111111111"],},
            { id: '1111111111111111111', chanel_label: "CH-82", frequency: 191.900000, width: 50.0, edges: ["-2242719450019019377", "-1111111111111111111"],},
        ]
        expect(groupByChanel(chanelDtata)).toEqual(expected);
      });
    })
    describe("mergeSpectrum", () => {
      it('should merge edge spectrum rows', () =>{
        const chanelData: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"},
          {edgeId: '2', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"}
        ]
        const edges: Edge[] =[
          {id:'1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10}
        ]

        const expected: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"}
        ]

        expect(mergeSpectrum(chanelData, edges)).toEqual(expected)
      })
      it('should not merge sepctrum form different chanels', () =>{
        const chanelData: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"},
          {edgeId: '1', channelId: '2', frequency: 195, channelWidth: 50, chanel_label: "CH-2"}
        ]
        const edges: Edge[] =[
          {id:'1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10}
        ]

        const expected: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"},
          {edgeId: '1', channelId: '2', frequency: 195, channelWidth: 50, chanel_label: "CH-2"}
        ]

        expect(mergeSpectrum(chanelData, edges)).toEqual(expected)
      })
      it('should not merge sepctrum from different edges', () =>{
        const chanelData: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"},
          {edgeId: '2', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"}
        ]
        const edges: Edge[] =[
          {id:'1', node1Id: '1', node2Id: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
          {id:'2', node1Id: '1', node2Id: '3', totalCapacity: '4.8 THz', provisionedCapacity: 10}
        ]

        const expected: EdgeSpectrumDataRow[] = [
          {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"},
          {edgeId: '2', channelId: '1', frequency: 195, channelWidth: 50, chanel_label: "CH-1"}
        ]

        expect(mergeSpectrum(chanelData, edges)).toEqual(expected)
      })
    })
});

describe("Build Network", () =>{
  describe("Simple data", ()=>{
    const edges: EdgeDataRow[] = [
      { id: '1', node1: '1', node2:'2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      { id: '2', node1: '2', node2:'1', totalCapacity: '4.8 THz', provisionedCapacity: 17,},
    ]
    const nodes: NodeDataRow[] = [
      {id: '1', latitude: 54.40027054, longitude: 18.58406944},
      {id: '2', latitude: 54.3593940734863,longitude: 18.645393371582},
    ]
    const chanels: EdgeSpectrumDataRow[] = [
      { edgeId: '1', channelId: '2', chanel_label: 'CH-1', channelWidth: 50, frequency: 195,},
      { edgeId: '2', channelId: '2', chanel_label: 'CH-1', channelWidth: 50, frequency: 195,}
    ]
    it("should merge edges before adding neighbors to nodes", () =>{
      const expectedEdges: Edge[] = [
        { id: '1', node1Id: '1', node2Id:'2', totalCapacity: '4.8 THz', provisionedCapacity: 10,},
      ]

      const expectedNode1: Node =  {id: '1', latitude: 54.40027054, longitude: 18.58406944, neighbors: []}
      const expectedNode2: Node = {id: '2', latitude: 54.3593940734863,longitude: 18.645393371582, neighbors: []}
      expectedNode1.neighbors.push({node: expectedNode2, edge: expectedEdges[0]})
      expectedNode2.neighbors.push({node: expectedNode1, edge: expectedEdges[0]})
      const expectedNodes: Node[] = [expectedNode1, expectedNode2]

      const chanelData: EdgeSpectrumDataRow[] = []

      const network: Network = buildNetwork(nodes, edges, chanelData)
      expect(network.nodes).toEqual(expectedNodes)
      expect(network.edges).toEqual(expectedEdges)

    })
    // it("Should return list of chanels with nodes instead of edges", () =>{
    //   const expectedChanel: Chanel[] = [
    //     {id: '1', chanel_label: 'Ch-1', width:50, frequency:195, nodes: ['1', '2']}
    //   ]

    //   const network: Network = buildNetwork(nodes, edges, chanels)
    //   expect(network.chanels).toEqual(expectedChanel)
    // })
  })
});