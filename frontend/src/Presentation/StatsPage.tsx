import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNavigate } from 'react-router-dom';
import { StyledH2 } from "../StyledComponents/header.tsx";
import { Button } from "../components/ui/button.tsx";

export const StatsPage = () => {
  const navigate = useNavigate();
  return (
    <MainContainer>
      <h1>Statystyki sieci</h1>
      <StatsOuterContainer>
        <StatsInnerContainer>
          <StyledH2>Najwęższe wolne pasmo</StyledH2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <StyledH2>Najbardziej zajęte połączenie</StyledH2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <StyledH2>Ogólna zajętość sieci</StyledH2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

      </StatsOuterContainer>
      <ButtonContainer>
        <DownloadReport />
        <Button variant={"outline"} onClick={() => navigate('/add-channel')}>
          Dodaj kanał
        </Button>
      </ButtonContainer>
    </MainContainer>
  )
}

const MainContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px"
})

const StatsOuterContainer = styled.div({
  marginTop: "2rem",
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
})

const StatsInnerContainer = styled.div({
  margin: "3px",
  borderRadius: "0.5rem",
  paddingLeft: "1rem",
})

const ButtonContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly"
})

