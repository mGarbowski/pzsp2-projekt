import styled from "@emotion/styled";
import { generateDemoReport } from "./generateReport.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { StyledButton } from "../StyledComponents/button.tsx";

export const DownloadReport = () => {

  const handleDownload = () => {
    const report = generateDemoReport();
    const blob = new Blob([report], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DownloadButtonContainer>
      <StyledButton onClick={handleDownload}>
        Pobierz raport
        <DownloadIcon icon={faFileExport} />
      </StyledButton>
    </DownloadButtonContainer >
  )
}

const DownloadButtonContainer = styled.div({
  display: "flex",
  placeContent: "center",
  marginTop: "5px"
})

const DownloadIcon = styled(FontAwesomeIcon)({
  fontSize: "1.5rem"
})
