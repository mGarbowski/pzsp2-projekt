import {OptimizerForm} from "./OptimizerForm";
import {MainContainer} from "../StyledComponents/MainContainer";
import {OptimizerResponse} from "./useOptimizer.ts";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {useState} from "react";
import styled from "@emotion/styled";

export const OptimizerPage = () => {
  const {network, setNetwork, setSelectedChannelId} = useNetwork();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResponse = (response: OptimizerResponse) => {
    if (response.type === "Success") {
      const updatedNetwork = {
        ...network!,
        channels: {
          ...network!.channels,
          [response.channel.id]: response.channel,
        }
      }
      setNetwork(updatedNetwork);
      setSelectedChannelId(response.channel.id);
      setSuccessMessage(`Pomyślnie wyznaczono kanał (${response.time.toFixed(1)} s)`);
    } else {
      setErrorMessage(`Błąd: ${response.message}`);
    }
  }

  return <MainContainer>
    <div className="mb-64 w-7/12">
      <h1 className="text-3xl font-bold mb-16 w-max">Dodaj kanał</h1>
      <OptimizerForm handleResponse={handleResponse}/>
      <MessageContainer>
        {successMessage && <p className="text-center font-bold text-green-200">{successMessage}</p>}
        {errorMessage && <p className="text-center font-bold text-red-200">{errorMessage}</p>}
      </MessageContainer>
    </div>
  </MainContainer>
}

const MessageContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "1rem",
})