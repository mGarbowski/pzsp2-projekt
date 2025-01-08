import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {Button} from "../Components/UI/button.tsx";
import styled from "@emotion/styled";
import {FileUpload} from "./FileUpload.tsx";

export const JsonImporterExporter = () => {
  const {network, setNetwork} = useNetwork();
  const [message, setMessage] = useState<string | null>(null);

  const handleDownload = () => {
    const data = JSON.stringify(network);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network.json';
    a.click();
    setMessage("Dane pobrano pomyślnie");
  }

  const handleUpload = (data: string) => {
    const network = JSON.parse(data);
    setNetwork(network);
    setMessage("Dane załadowano pomyślnie");
  }

  return (
    <Card className="mx-4 mb-16 w-min-9/12">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Pobierz lub załaduj stan sieci
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Fromat JSON</p>
        <ContentContainer>
          <Button className="mb-3" variant={"outline"} onClick={handleDownload}>
            Pobierz
          </Button>
          <FileUpload buttonText="Załaduj" accept=".json" onUpload={handleUpload}/>
          <p className="text-center font-bold text-green-200">{message}</p>
        </ContentContainer>
      </CardContent>
    </Card>
  )
}

const ContentContainer = styled.div({
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
});