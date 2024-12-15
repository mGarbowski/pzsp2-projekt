import { generateDemoReport } from "./generateReport.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { Button } from "../Components/UI/button.tsx";

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
    <div className="w-full">
      <Button className="w-full py-6 text-md m" variant={"outline"} onClick={handleDownload}>
        Pobierz raport
        <FontAwesomeIcon icon={faFileExport} />
      </Button>
    </div >
  )
}
