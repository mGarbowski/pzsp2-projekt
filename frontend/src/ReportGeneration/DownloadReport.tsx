import { generateChannelsReport } from "./generateReport.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { Button } from "../Components/UI/button.tsx";
import {useNetwork} from "../NetworkModel/NetworkContext.tsx";
export const DownloadReport = () => {

  const handleDownload = () => {
    const {network} = useNetwork()
    if (!network){
      return
    }
    const report = generateChannelsReport(Object.values(network.channels));
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
