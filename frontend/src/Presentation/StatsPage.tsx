import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";

export const StatsPage = () => {
  const navigate = useNavigate();
  const ipsum = `
            Explicabo nihil eligendi esse quia facere non. Unde accusantium ducimus sint.
            `
  return (
    <MainContainer>
      <StatsOuterContainer>
        <h1 className="text-3xl font-bold mb-16">Statystyki sieci</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Najwęższe wolne pasmo</CardTitle>
          </CardHeader>
          <CardContent>
            {ipsum}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Najbardziej zajęte połączenie</CardTitle>
          </CardHeader>
          <CardContent>
            {ipsum}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ogólna zajętość sieci</CardTitle>
          </CardHeader>
          <CardContent>
            {ipsum}
          </CardContent>
        </Card>

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
  gap: "1rem",
})

const ButtonContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly"
})

