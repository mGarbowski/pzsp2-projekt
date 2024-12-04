import { Edge, Node, ChanelEdge, buildNetwork, groupByChanel } from "./buildNetwork";
import { parseEdgeSpectrum } from "./parseCsv";


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