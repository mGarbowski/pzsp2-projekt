import { OptimizerForm } from "./OptimizerForm";
import { MainContainer } from "../StyledComponents/maincontainer";

export const OptimizerPage = () => {

  return <MainContainer>
    <div className="mb-64">
      <h1 className="text-3xl font-bold mb-16">Dodaj kanał</h1>
      <OptimizerForm />
    </div>
  </MainContainer >
}

