import { Edge, Node, ChanelEdge, buildNetwork, groupByChanel, handleNode, handleEdge, mergeEdges } from "./buildNetwork";
import { parseEdges, parseEdgeSpectrum , parseNodes} from "./parseCsv";


describe('Nodes', () =>{
  describe('create node', () =>{
    it('should create 1 node', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n';
      const parsed  = parseNodes(csvData);
      const expected: Node[] = [
        {
        id: '1',
        latitude: 34.05,
        longitude: -118.25,
        neighbors:  [],
        }
    ]

      expect(handleNode(parsed)).toEqual(expected)
    })

    it('should create 2 nodes', () => {
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed  = parseNodes(csvData);
      const expected: Node[] = [
        {
        id: '1',
        latitude: 34.05,
        longitude: -118.25,
        neighbors:  [],
        },
        {
          id: '2',
          latitude: 40.71,
          longitude: -74.01,
          neighbors:  [],
        }
    ]
    expect(handleNode(parsed)).toEqual(expected)
    })
  })
});

describe("Edges", () =>{
  describe("handle edge", () =>{
    it("should create edge and update neighbours", ()=>{
      const csvData = 'LOCATION,LATITUDE,LONGITUDE\n1,34.05,-118.25\n2,40.71,-74.01\n';
      const parsed  = parseNodes(csvData);
      const nodes = handleNode(parsed)

      const csvData_e = 'id,Endpoint 1,Endpoint 2,Total capacity,Provisioned capacity (%)\n1,1,2,4.8 THz,50';
      const parsed_e = parseEdges(csvData_e)

      const edge_e: Edge = {
        id: '1',
        node1Id: '1',
        node2Id:'2',
        totalCapacity: '4.8 THz',
        provisionedCapacity: 50,
      }
      const node_1_e: Node = {
        id: '1',
        latitude: 34.05,
        longitude: -118.25,
        neighbors:  [],
      }

      const node_2_e: Node = {
        id: '2',
        latitude: 40.71,
        longitude: -74.01,
        neighbors:  [],
      }
      node_1_e.neighbors.push({node: node_2_e, edge: edge_e})
      node_2_e.neighbors.push({node: node_1_e, edge: edge_e})
      const expexted_nodes: Node[] = [
        node_1_e,
        node_2_e,
      ]

      expect(handleEdge(parsed_e[0], nodes)).toEqual(edge_e)
      expect(nodes).toEqual(expexted_nodes)
    })
  })
  describe("handle edges", () =>{
    it('should merge edges with same nodes', () =>{
      const edges: Edge[] = [
        {
          id: '1',
          node1Id: '1',
          node2Id:'2',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        },
        {
          id: '2',
          node1Id: '2',
          node2Id:'1',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        }
      ]

      const expected: Edge[] = [
        {
          id: '1',
          node1Id: '1',
          node2Id:'2',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        }
      ]

      expect(mergeEdges(edges)).toEqual(expected)
    })
    it("should throw an exception when edge can't be merged", () =>{
      const edges: Edge[] = [
        {
          id: '1',
          node1Id: '1',
          node2Id:'2',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        }
      ]

      expect(() => mergeEdges(edges)).toThrow("Can't merge")

      const edges_2 : Edge[] = [
        {
          id: '1',
          node1Id: '1',
          node2Id:'2',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        },
        {
          id: '2',
          node1Id: '3',
          node2Id:'1',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 50,
        }
      ]

      expect(() => mergeEdges(edges_2)).toThrow("Can't merge")
    })
    it('should merge edges form more complicated input', () =>{
      const edges: Edge[] = [
        {
          id: '-160181617838685002',
          node1Id: '30990',
          node2Id:'39925',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 10,
        },
        {
          id: '-1924338652343423293',
          node1Id: '70080',
          node2Id:'60168',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 17,
        },
        {
          id: '-2017457964338917446',
          node1Id: '60168',
          node2Id:'70080',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 17,
        },
        {
          id: '-2188716338357475633',
          node1Id: '24246',
          node2Id:'40990',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 11,
        },
        {
          id: '-8373146988370601128',
          node1Id: '39925',
          node2Id:'30990',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 10,
        },
        {
          id: '-4373598137077956487',
          node1Id: '40990',
          node2Id:'24246',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 11,
        },

      ]

      const expected: Edge[] = [
        {
          id: '-160181617838685002',
          node1Id: '30990',
          node2Id:'39925',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 10,
        },
        {
          id: '-1924338652343423293',
          node1Id: '70080',
          node2Id:'60168',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 17,
        },
        {
          id: '-2188716338357475633',
          node1Id: '24246',
          node2Id:'40990',
          totalCapacity: '4.8 THz',
          provisionedCapacity: 11,
        },
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
            {
                id: '6007100605839137070',
                chanel_label: "CH-81",
                frequency: 191.900000,
                width: 50.0,
                edges: ["-2242719450019019377"],
            }
        ]
        expect(groupByChanel(chanelDtata)).toEqual(expected);
      });

      it('should group data to 1 chanel with 2 edges', () => {
        const EdgeSpectrum = "REQUESTED_FRE_ID,PHOTONIC_SERVICE_ID,FREQUENCY,WIDTH,WAVELENGTH,CHANNEL\n"+
        "-2242719450019019377,6007100605839137070,191.900000,37.5,1562.23,CH-81\n"+
        "-1111111111111111111,6007100605839137070,191.900000,37.5,1562.23,CH-81\n";
        const chanelDtata = parseEdgeSpectrum(EdgeSpectrum);
        const expected: ChanelEdge[] = [
            {
                id: '6007100605839137070',
                chanel_label: "CH-81",
                frequency: 191.900000,
                width: 50.0,
                edges: ["-2242719450019019377", "-1111111111111111111"],
            }
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
            {
                id: '6007100605839137070',
                chanel_label: "CH-81",
                frequency: 191.900000,
                width: 50.0,
                edges: ["-2242719450019019377", "-1111111111111111111"],
            },
            {
                id: '1111111111111111111',
                chanel_label: "CH-82",
                frequency: 191.900000,
                width: 50.0,
                edges: ["-2242719450019019377", "-1111111111111111111"],
            },
        ]
        expect(groupByChanel(chanelDtata)).toEqual(expected);
      });
    })
});