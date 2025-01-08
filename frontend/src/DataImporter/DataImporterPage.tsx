import styled from "@emotion/styled";
import {MainContainer} from "../StyledComponents/MainContainer.tsx";
import {CsvImporter} from "./CsvImporter.tsx";
import {DemoDataImporter} from "./DemoDataImporter.tsx";

export const DataImporterPage = () => {
  return (
    <MainContainer>
      <PageOuterContainer>
        <h1 className="text-3xl font-bold mb-8">Importer danych</h1>
        <ImporterOuterContainer>
          <CsvImporter/>
          <DemoDataImporter/>
        </ImporterOuterContainer>
      </PageOuterContainer>
    </MainContainer>
  );
}

const PageOuterContainer = styled.div({
  height: "80vh",
  marginBottom: "10rem",
  marginLeft: "3rem",
  marginRight: "3rem",
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  gap: "1rem",
})

const ImporterOuterContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
})
