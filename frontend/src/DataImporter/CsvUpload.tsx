import {ChangeEvent} from "react";

interface CsvUploadProps {
  onUpload: (data: string) => void;
}

export const CsvUpload = (props: CsvUploadProps) => {

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      props.onUpload(content);
    };
    reader.readAsText(file);
  }

  return <div>
    <input type="file" accept=".csv" onChange={handleFileUpload}/>
  </div>
}