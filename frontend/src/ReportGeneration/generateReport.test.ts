import {generateChannelsReport, HIGHEST_BEGINNING_FREQUENCY, LOWEST_BEGINNING_FREQUENCY} from "./generateReport";
import {Channel} from "../NetworkModel/network"

const generateExpectedHeading = () : string => {
  // central frequencies
  let final = "";
  [112.5, 50, 75].forEach((frequency) => {
    final += `Central frequency for ${frequency}GHz grid`
    let middle_freq = LOWEST_BEGINNING_FREQUENCY + frequency/2
    let next_step = LOWEST_BEGINNING_FREQUENCY + frequency
    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 6.25 ){
      if (slice_begin >=next_step){
        next_step += frequency;
        middle_freq += frequency
      }
      final += "," + middle_freq.toString()
    }
    final += "\n"
  });
  // 191325.00 GHz - 196087.50 GHz
  // 6.25 GHz each
  final += "Channel ID"
  for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 6.25 ){
    final += "," + slice_begin.toString()
  }
  final += "\n"
  return final
}


describe('generateReport', () => {
  it('should generate a row of two 1s for frequency: 191.33125, width: 12.5' , () => {

    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.33125,
      width: 12.5
    }
    let expectedReport = generateExpectedHeading()
    expectedReport += "id1,1,1"
    for (let i = 0; i < 768-(channel.width/6.25); i++) {
      expectedReport += ","

    }
    expectedReport += "\n"
    const generated = generateChannelsReport([channel])

    expect(generated).toBe(expectedReport)
  });

  it("should report eight 1's for frequency: 191.35 width: 50", () => {
    const channel: Channel = {
      id: "id1",
      nodes: ["1", "2", "3"],
      edges: ["1", "5", "13"],
      frequency: 191.35,
      width: 50
    }
    let expectedReport = generateExpectedHeading()
    const generated = generateChannelsReport([channel])
    expectedReport += "id1,1,1,1,1,1,1,1,1"
    for (let i = 0; i < 768-(channel.width/6.25); i++) {
      expectedReport += ","
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
    let expectedReport = generateExpectedHeading()
    const generated = generateChannelsReport([channel1, channel2])

    // channel 1
    expectedReport += "id1,1,1,1,1,1,1,1,1"
    // ones start from the beginning
    for (let i = 0; i < 768-(channel1.width/6.25); i++) {
      expectedReport += ","
    }
    // channel 2
    expectedReport += "\n" + "id2,,,1,1,1,1,1,1,1,1,1,1,1,1"
    //12 plus two empty at the beginning
    for (let i = 0; i < 768-(channel2.width/6.25)-2; i++) {
      expectedReport += ","
    }
    //ending
    expectedReport += "\n"

    expect(generated).toBe(expectedReport)
  });


});