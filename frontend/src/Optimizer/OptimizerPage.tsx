import { OptimizerForm } from "./OptimizerForm";
import { MainContainer } from "../StyledComponents/MainContainer";

export const OptimizerPage = () => {

  return <MainContainer>
    <div className="mb-64 w-7/12">
      <h1 className="text-3xl font-bold mb-16 w-max">Dodaj kanał</h1>
      <OptimizerForm />
    </div>
  </MainContainer >
}

