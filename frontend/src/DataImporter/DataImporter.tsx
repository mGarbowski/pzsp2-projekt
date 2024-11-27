import {useEffect, useState} from "react";
import {CsvUpload} from "./CsvUpload.tsx";
import {parseEdges, parseNodes} from "./parseCsv.ts";

export const DataImporter = () => {

  const [nodesData, setNodesData] = useState<string | null>(null);
  const [edgesData, setEdgesData] = useState<string | null>(null);


  useEffect(() => {
    if (!nodesData) {
      return;
    }
    console.info(parseNodes(nodesData));
  }, [nodesData]);

  useEffect(() => {
    if (!edgesData) {
      return;
    }
    console.info(parseEdges(edgesData));
  }, [edgesData]);

  return <div>
    <p>Węzły</p>
    <CsvUpload onUpload={(data) => setNodesData(data)}/>
    <p>Zajętość</p>
    <CsvUpload onUpload={(data) => setEdgesData(data)}/>
  </div>

}