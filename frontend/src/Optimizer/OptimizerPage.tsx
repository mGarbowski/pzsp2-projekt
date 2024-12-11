import { OptimizerForm } from "./OptimizerForm";
import styled from '@emotion/styled'

export const OptimizerPage = () => {

  return <MainContainer>
    <h1>Dodaj kanał</h1>
    <OptimizerForm />
  </MainContainer >
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
