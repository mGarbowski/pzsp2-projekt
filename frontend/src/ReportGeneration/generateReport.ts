import {Channel} from "../NetworkModel/network";

export const LOWEST_BEGINNING_FREQUENCY = 19_132_500
export const HIGHEST_BEGINNING_FREQUENCY = 19_611_875
export const generateDemoReport = () => {
  return "Channel ID,Slice #1,Slice #2,Slice #3,Slice #4,Slice #5\n" +
    "1234,1,0,0,0,0\n" +
    "2345,0,1,1,0,0\n" +
    "3456,1,0,0,0,0\n" +
    "4567,0,0,1,1,1\n" +
    "5678,0,0,0,0,0\n" +
    "6789,0,0,0,0,1\n";
}

export const generateChannelsReport = (channels: Channel[]): string => {


  const generateChannelRow = (channel: Channel) : string => {
    let row = ""
    const beginning_freq = channel.frequency*100_000 - channel.width*100/2
    const ending_freq = channel.frequency*100_000 + channel.width*100/2
    for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625 ){
      if (slice_begin < ending_freq && slice_begin >= beginning_freq){
        row += ",1"
      } else {
        row += ",0"
      }
    }
    return row + "\n"

  }
  let final = "Channel ID"
  // 191325.00 GHz - 196087.50 GHz
  // 6.25 GHz each
  for (let slice_begin = LOWEST_BEGINNING_FREQUENCY; slice_begin <= HIGHEST_BEGINNING_FREQUENCY; slice_begin += 625 ){
    final += "," + slice_begin.toString()
  }
  final += "\n"
  channels.forEach((channel) => {
    let row = channel.id
    row += generateChannelRow(channel)
    final += row
  })

  return final
}