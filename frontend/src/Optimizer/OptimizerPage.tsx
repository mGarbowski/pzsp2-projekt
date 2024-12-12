import { OptimizerForm } from "./OptimizerForm";
import styled from '@emotion/styled'

export const OptimizerPage = () => {

  return <MainContainer>
    <div className="mb-64">
      <h1 className="text-3xl font-bold mb-16">Dodaj kanał</h1>
      <OptimizerForm />
    </div>
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
