import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNavigate } from 'react-router-dom';
import { StyledButton } from "../StyledComponents/button.tsx";
import { StyledH2 } from "../StyledComponents/header.tsx";

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
        <StyledButton onClick={() => navigate('/add-channel')}>
          Dodaj kanał
        </StyledButton>
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
  backgroundColor: "#FDF4F5",
  margin: "3px",
  borderRadius: "0.5rem",
  paddingLeft: "1rem",
  "&:hover": {
    backgroundColor: "#BEAEE2"
  }
})

const ButtonContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly"
})

