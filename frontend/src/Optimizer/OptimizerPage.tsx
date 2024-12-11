import { OptimizerForm } from "./OptimizerForm";
import styled from '@emotion/styled'

export const OptimizerPage = () => {
  // const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
  // const url = `${backendBaseUrl}/ws/optimizer`;

  return <MainContainer>
    <OptimizerForm />
  </MainContainer >
}

const MainContainer = styled.div({
  layout: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px"
});
