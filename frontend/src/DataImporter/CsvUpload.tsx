import { ChangeEvent, useRef, useState } from "react";
import styled from '@emotion/styled'
import { Button } from "../Components/UI/button";

interface CsvUploadProps {
  onUpload: (data: string) => void;
}

export const CsvUpload = (props: CsvUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  return <div className="flex flex-col w-1/2">
    <HiddenFileInput type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} />
    <Button className="mb-3" variant={"outline"} onClick={() => fileInputRef.current?.click()}>
      Wybierz plik
    </Button>
    {fileName && <p className="mb-5">{fileName}</p>}
  </div>
}

const HiddenFileInput = styled.input({
  display: "none",
});

