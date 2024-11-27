import {useEffect, useState} from "react";
import {CsvUpload} from "./CsvUpload.tsx";
import {parseNodes} from "./parseCsv.ts";

export const DataImporter = () => {

  const [nodesData, setNodesData] = useState<string | null>(null);
  const [edgesData, setEdgesData] = useState<string | null>(null);


  useEffect(() => {
    if (!nodesData) {
      return;
    }
    console.info(parseNodes(nodesData));
  }, [nodesData]);

  return <div>
    <p>Węzły</p>
    <CsvUpload onUpload={(data) => setNodesData(data)}/>
    <p>Zajętość</p>
    <CsvUpload onUpload={(data) => setEdgesData(data)}/>
  </div>

}