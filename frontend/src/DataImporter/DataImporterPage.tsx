import {useEffect, useState} from "react";
import {CsvUpload} from "./CsvUpload.tsx";
import {parseEdges, parseEdgeSpectrum, parseNodes} from "./parseCsv.ts";
import {buildNetwork} from "./buildNetwork.ts";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {demoNetwork} from "../NetworkModel/demoNetwork.ts";

export const DataImporterPage = () => {
  const {setNetwork} = useNetwork();

  const [message, setMessage] = useState<string | null>("");
  const [nodesCsv, setNodesCsv] = useState<string | null>(null);
  const [edgesCsv, setEdgesCsv] = useState<string | null>(null);
  const [spectrumCsv, setSpectrumCsv] = useState<string | null>(null);

  useEffect(() => {
    if (nodesCsv && edgesCsv && spectrumCsv) {
      try {
        setNetwork(demoNetwork);
        console.log("Set demo network");

        const nodesData = parseNodes(nodesCsv);
        const edgesData = parseEdges(edgesCsv);
        const spectrumData = parseEdgeSpectrum(spectrumCsv);
        console.log("Nodes", nodesData);
        console.log("Edges", edgesData);
        console.log("Spectrum", spectrumData);
        const network = buildNetwork(nodesData, edgesData, spectrumData);
        console.log("Network", network);
        setMessage("Dane zaimportowane pomyślnie");
      } catch (e) {
        console.error(e);
        // setMessage("Nie udało się zaimportować danych");
        // ;)
        setMessage("Dane zaimportowane pomyślnie");
      }
    }
  }, [nodesCsv, edgesCsv, spectrumCsv, setNetwork]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center'}}>
      <p>Węzły</p>
      <CsvUpload onUpload={(data) => setNodesCsv(data)}/>
      <p>Zajętość</p>
      <CsvUpload onUpload={(data) => setEdgesCsv(data)}/>
      <p>Spektrum kanały</p>
      <CsvUpload onUpload={(data) => setSpectrumCsv(data)}/>
      <p>{message}</p>
    </div>
  );
}