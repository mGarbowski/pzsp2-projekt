import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OptimizerPage } from "./Optimizer/OptimizerPage.tsx";
import { NoPage } from "./NoPage.tsx";
import { Layout } from "./Layout.tsx";
import { StatsPage } from "./Presentation/StatsPage.tsx";
import { DataImporterPage } from './DataImporter/DataImporterPage.tsx';
import { ThemeProvider } from "./Components/themeProvider.tsx";
import { NetworkProvider } from "./NetworkModel/NetworkContext.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NetworkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DataImporterPage />} />
              <Route path="import" element={<DataImporterPage />} />
              <Route path="add-channel" element={< OptimizerPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
