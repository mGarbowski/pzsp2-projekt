import styled from "@emotion/styled";
import { generateDemoReport } from "./generateReport.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'

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
      <DownloadButton onClick={handleDownload}>
        Pobierz raport
        <DownloadIcon icon={faFileExport} />
      </DownloadButton>
    </DownloadButtonContainer>
  )
}

const DownloadButtonContainer = styled.div({
  display: "flex",
  placeContent: "center",
  marginTop: "5px"
})

const DownloadButton = styled.button({
  display: "flex",
  flexDirection: "column",
  padding: "8px 10px",
  margin: "0px 0px 20px 0px",
  cursor: "pointer",
  backgroundColor: "white",
  color: "black",
  borderStyle: "solid",
  borderRadius: "5px",
  fontSize: "1.1rem",
  "&:hover": {
    backgroundColor: "#EEE",
  },
});

const DownloadIcon = styled(FontAwesomeIcon)({
  fontSize: "1.5rem"
})
