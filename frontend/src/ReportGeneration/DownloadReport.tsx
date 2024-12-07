import {generateDemoReport} from "./generateReport.ts";

export const DownloadReport = () => {
  const handleDownload = () => {
    const report = generateDemoReport();
    const blob = new Blob([report], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2>Download Report</h2>
      <button onClick={handleDownload}>Download</button>
    </div>
  )
}