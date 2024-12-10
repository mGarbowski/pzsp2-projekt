import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";

export const StatsPage = () => {
  return (
    <MainContainer>
      <h1>Statystyki sieci</h1>
      <StatsOuterContainer>
        <StatsInnerContainer>
          <StatsHeader>Najwęższe wolne pasmo</StatsHeader>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <StatsHeader>Najbardziej zajęte połączenie</StatsHeader>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <StatsHeader>Ogólna zajętość sieci</StatsHeader>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

      </StatsOuterContainer>
      <div>
        <DownloadReport />
      </div>
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

const StatsHeader = styled.h2({
  fontWeight: "normal",
  fontSize: "1.2rem"
})

