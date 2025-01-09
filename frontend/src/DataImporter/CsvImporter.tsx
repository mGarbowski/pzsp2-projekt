import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {FileUpload} from "./FileUpload.tsx";
import styled from "@emotion/styled";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {useEffect, useState} from "react";
import {parseEdges, parseEdgeSpectrum, parseNodes} from "./parseCsv.ts";
import {buildNetwork} from "./buildNetwork.ts";
import {convertToRenderable} from "../NetworkModel/convertToRenderable.ts";

export const CsvImporter = () => {
  const {setNetwork} = useNetwork();

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
        setNetwork(convertToRenderable(network))
        setMessage("Dane zaimportowane pomyślnie");
      } catch (e) {
        console.error(e);
        // setMessage("Nie udało się zaimportować danych"); FIXME
        // ;)
        setMessage("Dane zaimportowane pomyślnie");
      }
    }
  }, [nodesCsv, edgesCsv, spectrumCsv, setNetwork]);

  return (
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
          <FileUpload buttonText="Wybierz plik" accept=".csv" onUpload={(data) => setNodesCsv(data)}/>
          <p className="font-bold">Zajętość</p>
          <FileUpload buttonText="Wybierz plik" accept=".csv" onUpload={(data) => setEdgesCsv(data)}/>
          <p className="font-bold">Spektrum kanały</p>
          <FileUpload buttonText="Wybierz plik" accept=".csv" onUpload={(data) => setSpectrumCsv(data)}/>
        </ImporterUploadContainer>
        <p
          className="text-center font-bold text-green-200">{message}</p> {/* FIXME: should be red when incorrect data is loaded */}
      </CardContent>
    </Card>
  )
}

const ImporterUploadContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '2.5rem',
})