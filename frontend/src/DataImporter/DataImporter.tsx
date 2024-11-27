import {useState} from "react";
import {CsvUpload} from "./CsvUpload.tsx";
import {parseEdges, parseEdgeSpectrum, parseNodes} from "./parseCsv.ts";
import {buildNetwork} from "./buildNetwork.ts";

export const DataImporter = () => {

  const [nodesCsv, setNodesCsv] = useState<string | null>(null);
  const [edgesCsv, setEdgesCsv] = useState<string | null>(null);
  const [spectrumCsv, setSpectrumCsv] = useState<string | null>(null);

  if (nodesCsv && edgesCsv && spectrumCsv) {
    const nodesData = parseNodes(nodesCsv);
    const edgesData = parseEdges(edgesCsv);
    const spectrumData = parseEdgeSpectrum(spectrumCsv);
    const network = buildNetwork(nodesData, edgesData);
    console.log("Network", network);
    console.log("Spectrum", spectrumData);
  }

  return <div>
    <p>Węzły</p>
    <CsvUpload onUpload={(data) => setNodesCsv(data)}/>
    <p>Zajętość</p>
    <CsvUpload onUpload={(data) => setEdgesCsv(data)}/>
    <p>Spektrum kanały</p>
    <CsvUpload onUpload={(data) => setSpectrumCsv(data)}/>
  </div>

}