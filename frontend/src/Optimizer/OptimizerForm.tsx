import React, { useState } from "react"
import { StyledButton } from "../StyledComponents/button";

export const OptimizerForm = () => {
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [bandwidth, setBandwidth] = useState<string | null>(null);
  const [optimizer, setOptimizer] = useState<string | null>(null);

  const handleSubmit = (_: React.FormEvent) => {
    console.log("Start node: ", startNode);
    console.log("End node: ", endNode);
    console.log("Bandwidth: ", bandwidth);
    console.log("Optimizer: ", optimizer);
    alert("Channel added");
  }

  return <form onSubmit={handleSubmit}>
    <label>
      Węzeł startowy
      <input
        type="text"
        placeholder="ID węzła"
        value={startNode || ""}
        onChange={(e) => setStartNode(e.target.value)}
        required={true}
        style={{
          display: "block",
          marginTop: "5px",
          marginBottom: "15px",
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </label>

    <label>
      Węzeł końcowy
      <input
        type="text"
        placeholder="ID węzła"
        required={true}
        value={endNode || ""}
        onChange={(e) => setEndNode(e.target.value)}
        style={{
          display: "block",
          marginTop: "5px",
          marginBottom: "15px",
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </label>

    <label>
      Przepustowość
      <select
        value={bandwidth || ""}
        onChange={(e) => setBandwidth(e.target.value)}
        required={true}
        style={{
          display: "block",
          marginTop: "5px",
          marginBottom: "15px",
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="10Gb/s">10Gb/s</option>
        <option value="40Gb/s">40Gb/s</option>
        <option value="100Gb/s">100Gb/s</option>
        <option value="400Gb/s">400Gb/s</option>
      </select>
    </label>

    <label>
      Optymalizator
      <select
        value={optimizer || ""}
        onChange={(e) => setOptimizer(e.target.value)}
        required={true}
        style={{
          display: "block",
          marginTop: "5px",
          marginBottom: "15px",
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="dijkstra">Algorytm Dijkstry</option>
        <option value="integer">Model całkowitoliczbowy</option>
      </select>
    </label>

    <StyledButton type="submit" >
      Dodaj kanał
    </StyledButton >


  </form>
}
