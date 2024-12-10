import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WelcomePage } from "./WelcomePage.tsx";
import { OptimizerPage } from "./Optimizer/OptimizerPage.tsx";
import { NoPage } from "./NoPage.tsx";
import { Layout } from "./Layout.tsx";
import { StatsPage } from "./Presentation/StatsPage.tsx";
import { DataImporterPage } from './DataImporter/DataImporterPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="import" element={<DataImporterPage />} />
          <Route path="add-channel" element={< OptimizerPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
