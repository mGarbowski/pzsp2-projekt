import {
  buildNetwork,
  Edge,
  handleEdge,
  handleNode,
  discardRedundantEdges,
  Network,
  Node,
  removeIsolatedNodes,
  checkIfEdgesExist
} from "./buildNetwork";
import {EdgeDataRow, EdgeSpectrumDataRow, NodeDataRow, parseEdges, parseNodes} from "./parseCsv";


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
  describe("removeIsolatedNodes",()=>{
    it("should remove nodes without neighbors from list", () =>{
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
    it("should create an edge and update its nodes by adding neighbors", () => {
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
  describe("discardRedundantEdges", () => {
    it('should keep first edge connecting the same nodes', () => {
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '2', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      const expected: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(discardRedundantEdges(edges)).toEqual(expected)
    })
    it("should discard edges that can't be merged", () => {
      const edges: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,}
      ]

      expect(discardRedundantEdges(edges)).toEqual([])

      const edges_2: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '2', node1: '3', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
        {id: '3', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
      ]

      const expected: EdgeDataRow[] = [
        {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 50,},
      ]

      expect(discardRedundantEdges(edges_2)).toEqual(expected)
    })
    it('should discard redundant edges from more complicated input', () => {
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

      expect(discardRedundantEdges(edges)).toEqual(expected)
    })
  })
});

describe("checkIfEdgesExist", () =>{
  it('should exit successfully if all edges exist', () => {
    const channelData: EdgeSpectrumDataRow[] = [
      {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
      {edgeId: '2', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
    ]
    const edges: EdgeDataRow[] = [
      {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
      {id: '2', node1: '2', node2: '1', totalCapacity: '4.8 THz', provisionedCapacity: 10}
    ]

    expect(() => checkIfEdgesExist(channelData, edges)).not.toThrow()
  })
  it('should throw an error if EdgeSpectrum refers to non existent edge', () => {
    const channelData: EdgeSpectrumDataRow[] = [
      {edgeId: '1', channelId: '1', frequency: 195, channelWidth: 50, channel_label: "CH-1"},
      {edgeId: '2', channelId: '2', frequency: 195, channelWidth: 50, channel_label: "CH-1"}
    ]
    const edges: EdgeDataRow[] = [
      {id: '1', node1: '1', node2: '2', totalCapacity: '4.8 THz', provisionedCapacity: 10},
    ]

    expect(() => checkIfEdgesExist(channelData, edges)).toThrow("Edge does not exists")
  })
})

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