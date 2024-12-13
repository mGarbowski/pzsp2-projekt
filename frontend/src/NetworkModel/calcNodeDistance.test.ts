import {calcNodeDistance} from './calcNodeDistance';
import {Node} from './network';

describe('calcNodeDistance', () => {
  it('should calculate the distance between Warsaw and Krakow', () => {
    const warsaw: Node = {
      id: '1',
      latitude: 52.2297,
      longitude: 21.0122,
      neighbors: []
    };

    const krakow: Node = {
      id: '2',
      latitude: 50.0647,
      longitude: 19.9450,
      neighbors: []
    };

    const distance = calcNodeDistance(warsaw, krakow);

    expect(distance).toBeCloseTo(252, 0);
  });
});