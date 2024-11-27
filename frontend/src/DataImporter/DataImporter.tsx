import {useState} from "react";
import {CsvUpload} from "./CsvUpload.tsx";
import {parseEdges, parseNodes} from "./parseCsv.ts";
import {buildNetwork} from "./buildNetwork.ts";

export const DataImporter = () => {

  const [nodesCsv, setNodesCsv] = useState<string | null>(null);
  const [edgesCsv, setEdgesCsv] = useState<string | null>(null);

  if (nodesCsv && edgesCsv) {
    const nodesData = parseNodes(nodesCsv);
    const edgesData = parseEdges(edgesCsv);
    const network = buildNetwork(nodesData, edgesData);
    console.log("Network", network);
  }

  return <div>
    <p>Węzły</p>
    <CsvUpload onUpload={(data) => setNodesCsv(data)}/>
    <p>Zajętość</p>
    <CsvUpload onUpload={(data) => setEdgesCsv(data)}/>
  </div>

}