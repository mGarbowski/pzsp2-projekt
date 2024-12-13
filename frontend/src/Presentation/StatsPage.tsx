import styled from "@emotion/styled";
import { DownloadReport } from "../ReportGeneration/DownloadReport.tsx";
import { useNavigate } from 'react-router-dom';
import { Button } from "../Components/UI/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/UI/card.tsx";
import { MainContainer } from "../StyledComponents/MainContainer.tsx";

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
          <Button className="w-full py-6 text-md" variant={"outline"} onClick={() => navigate('/add-channel')}>
            Dodaj kanał
          </Button>
        </ButtonContainer>

      </StatsOuterContainer>
    </MainContainer>
  )
}

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
  gap: "0.3rem"
})

