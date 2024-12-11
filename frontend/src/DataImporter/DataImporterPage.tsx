import { useEffect, useState } from "react";
import { CsvUpload } from "./CsvUpload.tsx";
import { parseEdges, parseEdgeSpectrum, parseNodes } from "./parseCsv.ts";
import { buildNetwork } from "./buildNetwork.ts";
import styled from "@emotion/styled";

export const DataImporterPage = () => {
  const [message, setMessage] = useState<string | null>("");
  const [nodesCsv, setNodesCsv] = useState<string | null>(null);
  const [edgesCsv, setEdgesCsv] = useState<string | null>(null);
  const [spectrumCsv, setSpectrumCsv] = useState<string | null>(null);

  useEffect(() => {
    if (nodesCsv && edgesCsv && spectrumCsv) {
      try {
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
        setMessage("Nie udało się zaimportować danych");
      }
    }
  }, [nodesCsv, edgesCsv, spectrumCsv]);

  return (
    <ImporterOuterContainer>
      <ImporterInnerContainer>
        <h2>Wgraj dane sieci</h2>
        <p>Wymagane są pliki w formacie .csv</p>
        <ImporterUploadContainer>
          <p>Węzły</p>
          <CsvUpload id="nodes" onUpload={(data) => setNodesCsv(data)} />
          <p>Zajętość</p>
          <CsvUpload id="cap" onUpload={(data) => setEdgesCsv(data)} />
          <p>Spektrum kanały</p>
          <CsvUpload id="spectrum" onUpload={(data) => setSpectrumCsv(data)} />
        </ImporterUploadContainer>
        <p>{message}</p>
      </ImporterInnerContainer>
    </ImporterOuterContainer>
  );
}


const ImporterOuterContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
})

const ImporterInnerContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
  borderRadius: "8px",
  alignItems: 'center',
  padding: "10px 10px",
  maxWidth: "80%",
  minWidth: "50%",
  marginBottom: "10rem"
})

const ImporterUploadContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '2.5rem',
})
