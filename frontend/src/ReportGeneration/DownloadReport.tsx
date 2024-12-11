import styled from "@emotion/styled";
import { generateDemoReport } from "./generateReport.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { Button } from "../components/ui/button.tsx";

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
      <Button onClick={handleDownload}>
        Pobierz raport
        <DownloadIcon icon={faFileExport} />
      </Button>
    </DownloadButtonContainer >
  )
}

const DownloadButtonContainer = styled.div({
  display: "flex",
  placeContent: "center",
})

const DownloadIcon = styled(FontAwesomeIcon)({
  fontSize: "1.5rem"
})
