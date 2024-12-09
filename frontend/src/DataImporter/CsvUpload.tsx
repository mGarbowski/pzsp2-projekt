import { ChangeEvent, useState } from "react";
import styled from '@emotion/styled'

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
    <ConnectedButton htmlFor={props.id}>Wybierz plik</ConnectedButton>
    {fileName && <p>{fileName}</p>}
  </div>
}

const HiddenFileInput = styled.input({
  display: "none",
});

const ConnectedButton = styled("label")({
  padding: "8px 10px",
  margin: "0px 0px 20px 0px",
  cursor: "pointer",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "5px",
  "&:hover": {
    backgroundColor: "#444",
  },
});
