import styled from "@emotion/styled";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/UI/card.tsx";
import { useEffect, useState } from "react";
import { CsvUpload } from "./CsvUpload.tsx";
import { parseEdges, parseEdgeSpectrum, parseNodes } from "./parseCsv.ts";
import { buildNetwork } from "./buildNetwork.ts";
import { useNetwork } from "../NetworkModel/NetworkContext.tsx";
import { demoNetwork } from "../NetworkModel/demoNetwork.ts";
import {useOptimizer} from "../Optimizer/useOptimizer.ts";
import {Channel} from "../NetworkModel/network.ts";

export const DataImporterPage = () => {
  const { setNetwork } = useNetwork();

  const [message, setMessage] = useState<string | null>("");
  const [nodesCsv, setNodesCsv] = useState<string | null>(null);
  const [edgesCsv, setEdgesCsv] = useState<string | null>(null);
  const [spectrumCsv, setSpectrumCsv] = useState<string | null>(null);

  const {sendQuery, lastMessage} = useOptimizer("ws://localhost:8000/ws/network/upload", (msg) => msg === "DISCONNECT");

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
        // setMessage("Nie udało się zaimportować danych"); FIXME
        // ;)
        setMessage("Dane zaimportowane pomyślnie");
      }
    }
  }, [nodesCsv, edgesCsv, spectrumCsv, setNetwork]);

  const handleTestUpload = () => {
    sendQuery(JSON.stringify(demoNetwork));
  }

  const handleSeeLastMessage = () => {
    const channel = JSON.parse(JSON.parse(lastMessage!)) as Channel;
    console.log(channel);
    console.log(typeof channel);
  }

  return (
    <ImporterOuterContainer>
      <Card className="mx-4 mb-16 w-min-9/12">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Zaimportuj dane sieci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Wymagane są pliki w formacie .csv</p>

          <ImporterUploadContainer>
            <p className="font-bold">Węzły</p>
            <CsvUpload onUpload={(data) => setNodesCsv(data)} />
            <p className="font-bold">Zajętość</p>
            <CsvUpload onUpload={(data) => setEdgesCsv(data)} />
            <p className="font-bold">Spektrum kanały</p>
            <CsvUpload onUpload={(data) => setSpectrumCsv(data)} />
          </ImporterUploadContainer>
          <button onClick={handleTestUpload}>Test upload</button>
          <button onClick={handleSeeLastMessage}>See last message</button>
          <p className="text-center font-bold text-green-200">{message}</p> {/* FIXME: should be red when incorrect data is loaded */}
        </CardContent>

      </Card>
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

const ImporterUploadContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '2.5rem',
})
