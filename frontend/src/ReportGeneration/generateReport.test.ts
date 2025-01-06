import {generateChannelsReport, HIGHEST_BEGINNING_FREQUENCY, LOWEST_BEGINNING_FREQUENCY} from "./generateReport";
import {Channel} from "../NetworkModel/network"

describe('generateReport', () => {
  it('should generate a row of two 1s for frequency: 191.33125, width: 12.5' , () => {

    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.33125,
      width: 12.5
    }
    let expectedReport = "Channel ID"

    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625) {
      expectedReport += "," + slice_begin.toString()
    }
    expectedReport += "\n" + "id1,1,1"
    for (let i = 0; i < 768-(channel.width/6.25); i++) {
      expectedReport += ",0"
    }
    expectedReport += "\n"
    let generated = generateChannelsReport([channel])

    expect(generated).toBe(expectedReport)
  });

  it("should report a 0 and six 1's for frequency: 191.35 width: 50", () => {
    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.35,
      width: 50
    }
    let expectedReport = "Channel ID"
    let generated = generateChannelsReport([channel])

    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625) {
      expectedReport += "," + slice_begin.toString()
    }
    expectedReport += "\n" + "id1,1,1,1,1,1,1,1,1"
    for (let i = 0; i < 768-(channel.width/6.25); i++) {
      expectedReport += ",0"
    }
    expectedReport += "\n"

    expect(generated).toBe(expectedReport)
  });
  it("should report two rows for two channels", () => {
    const channel1: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.35,
      width: 50
    }
    const channel2: Channel = {
      id: "id2",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.375,
      width: 75
    }
    let expectedReport = "Channel ID"
    let generated = generateChannelsReport([channel1, channel2])

    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625) {
      expectedReport += "," + slice_begin.toString()
    }
    // channel 1
    expectedReport += "\n" + "id1,1,1,1,1,1,1,1,1"
    // ones start from the beginning
    for (let i = 0; i < 768-(channel1.width/6.25); i++) {
      expectedReport += ",0"
    }
    // channel 2
    expectedReport += "\n" + "id2,0,0,1,1,1,1,1,1,1,1,1,1,1,1"
    //12 plus two zeros at the beginning
    for (let i = 0; i < 768-(channel2.width/6.25)-2; i++) {
      expectedReport += ",0"
    }
    //ending
    expectedReport += "\n"

    expect(generated).toBe(expectedReport)
  });


});