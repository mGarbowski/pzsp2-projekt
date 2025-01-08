import styled from "@emotion/styled";
import {MainContainer} from "../StyledComponents/MainContainer.tsx";
import {CsvImporter} from "./CsvImporter.tsx";
import {DemoDataImporter} from "./DemoDataImporter.tsx";
import {JsonImporterExporter} from "./JsonImporterExporter.tsx";

export const DataImporterPage = () => {
  return (
    <MainContainer>
      <PageOuterContainer>
        <h1 className="text-3xl font-bold mb-8">Importer danych</h1>
        <ImporterOuterContainer>
          <Column>
            <CsvImporter/>
          </Column>
          <Column>
            <DemoDataImporter/>
            <JsonImporterExporter/>
          </Column>
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
  flexDirection: 'row',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
})

const Column = styled.div({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});
