import {generateChannelsReport} from "./generateReport";
import {Channel} from "../NetworkModel/network"

describe('calcNodeDistance', () => {
  it('should calculate the distance between Warsaw and Krakow', () => {

    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.33125,
      width: 12.5
    }
    const LOWEST_BEGINNING_FREQUENCY = 19132500
    const HIGHEST_BEGINNING_FREQUENCY = 19608750

    let expectedReport = "Channel ID"

    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625 ){
      expectedReport += "," + slice_begin.toString()
    }
    expectedReport += "\n" + "id1,1,1"
    for (let i = 0; i < 766; i++){
      expectedReport += ",0"
    }
    expectedReport += "\n"
    let generated = generateChannelsReport([channel])

    expect(generated).toBe(expectedReport)
  });
});