import {generateChannelsReport} from "./generateReport.ts";
import {Channel} from "../NetworkModel/network.ts"

describe('calcNodeDistance', () => {
  it('should calculate the distance between Warsaw and Krakow', () => {

    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.33125,
      width: 13.0
    }
    let expectedReport = "Channel ID,Slice #1,Slice #2,Slice #3,Slice #4,Slice #5\n" +
      "id1,1,1"
    for (let i = 0; i < 766; i++){
      expectedReport += ",0"
    }
    expectedReport += "\n"
    let generated = generateChannelsReport([channel])

    expect(generated).toBe(expectedReport)
  });
});