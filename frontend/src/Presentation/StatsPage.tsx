import styled from "@emotion/styled";
import {DownloadReport} from "../ReportGeneration/DownloadReport.tsx";
import {useNavigate} from 'react-router-dom';
import {Button} from "../Components/UI/button.tsx";
import {MainContainer} from "../StyledComponents/MainContainer.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
import {NodeStats} from "./NodeStats.tsx";
import {EdgeStats} from "./EdgeStats.tsx";
import {NetworkStats} from "./NetworkStats.tsx";
import {ChannelSelectionCard} from "./ChannelSelectionCard.tsx";
import {ChannelStats} from "./ChannelStats.tsx";

export const StatsPage = () => {
  const navigate = useNavigate();
  const {network, selectedNodeId, selectedEdgeId} = useNetwork();
  const selectedNode = selectedNodeId ? network?.nodes[selectedNodeId] : null;
  const selectedEdge = selectedEdgeId ? network?.edges[selectedEdgeId] : null;

  return (
    <MainContainer>
      <StatsOuterContainer>
        <h1 className="text-3xl font-bold mb-8">Statystyki sieci</h1>
        <h2 className="text-xl mb-8">Kliknij element na prezentacji żeby zobaczyć szczegółowe informacje</h2>
        <StatCardsContainer>

          <NetworkStats/>

          <ChannelSelectionCard/>

          <ChannelStats/>

          {selectedNode && (<NodeStats node={selectedNode}/>)}

          {selectedEdge && (<EdgeStats edge={selectedEdge}/>)}
        </StatCardsContainer>

        <ButtonContainer>
          <DownloadReport/>
          <Button className="w-full py-6 text-md" variant={"outline"} onClick={() => navigate('/add-channel')}>
            Dodaj kanał
          </Button>
        </ButtonContainer>

      </StatsOuterContainer>
    </MainContainer>
  )
}

const StatCardsContainer = styled.div({
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
})

const StatsOuterContainer = styled.div({
  height: "80vh",
  marginBottom: "10rem",
  marginLeft: "3rem",
  marginRight: "3rem",
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  gap: "1rem",
})

const ButtonContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  gap: "0.3rem"
})

