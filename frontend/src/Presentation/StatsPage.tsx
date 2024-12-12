import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button.tsx";

export const StatsPage = () => {
  const navigate = useNavigate();
  return (
    <MainContainer>
      <StatsOuterContainer>
        <h1 className="text-3xl font-bold mb-16">Statystyki sieci</h1>
        <StatsInnerContainer>
          <h2>Najwęższe wolne pasmo</h2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <h2>Najbardziej zajęte połączenie</h2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <StatsInnerContainer>
          <h2>Ogólna zajętość sieci</h2>
          <p>Lorem ipsum </p>
        </StatsInnerContainer>

        <ButtonContainer>
          <DownloadReport />
          <Button variant={"outline"} onClick={() => navigate('/add-channel')}>
            Dodaj kanał
          </Button>
        </ButtonContainer>

      </StatsOuterContainer>
    </MainContainer>
  )
}

const MainContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  marginLeft: "10px",
  marginTop: "10px",
  alignItems: 'center',
  height: '100vh',
  justifyContent: 'center',
});
const StatsOuterContainer = styled.div({
  marginBottom: "10rem",
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

