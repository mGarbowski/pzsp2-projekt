import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WelcomePage } from "./WelcomePage.tsx";
import { OptimizerPage } from "./Optimizer/OptimizerPage.tsx";
import { NoPage } from "./NoPage.tsx";
import { Layout } from "./Layout.tsx";
import { PresentationPage } from "./Presentation/PresentationPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="optimizer" element={<OptimizerPage />} />
          <Route path="presentation" element={<PresentationPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
