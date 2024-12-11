import { ChangeEvent, useState } from "react";
import styled from '@emotion/styled'
import { Button } from "../components/ui/button";

interface CsvUploadProps {
  id: string
  onUpload: (data: string) => void;
}

export const CsvUpload = (props: CsvUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
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
    setFileName(file.name);
  }

  return <div>
    <HiddenFileInput type="file" accept=".csv" id={props.id} onChange={handleFileUpload} />
    <Button>
      <label htmlFor={props.id}>
        Wybierz plik
      </label>
    </Button>
    {fileName && <p>{fileName}</p>}
  </div>
}

const HiddenFileInput = styled.input({
  display: "none",
});

