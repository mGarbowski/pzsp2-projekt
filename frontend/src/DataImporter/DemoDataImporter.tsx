import {Card, CardContent, CardHeader, CardTitle} from "../Components/UI/card.tsx";
import {Button} from "../Components/UI/button.tsx";
import {demoNetwork} from "../NetworkModel/demoNetwork.ts";
import {useState} from "react";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import styled from "@emotion/styled";

export const DemoDataImporter = () => {
  const {setNetwork} = useNetwork();
  const [message, setMessage] = useState<string | null>(null);

  const handleLoad = () => {
    setNetwork(demoNetwork);
    setMessage("Dane załadowano pomyślnie");
  }

  return (
    <Card className="mx-4 mb-16 w-min-9/12">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Zaimportuj dane demonstracyjne
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ContentContainer>
          <Button className="mb-3" variant={"outline"} onClick={handleLoad}>
            Wczytaj demo
          </Button>
          <p className="text-center font-bold text-green-200">{message}</p>
        </ContentContainer>
      </CardContent>
    </Card>
  )
}

const ContentContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});