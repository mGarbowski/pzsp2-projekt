import React, { useState } from "react"
import { StyledButton } from "../StyledComponents/button";
import styled from '@emotion/styled'

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

  return <StyledForm onSubmit={handleSubmit}>
    <label>
      Węzeł startowy
      <TextInput
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
      <TextInput
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
      <SelectInput
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
      </SelectInput>
    </label>

    <label>
      Optymalizator
      <SelectInput
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
      </SelectInput>
    </label>

    <StyledButton type="submit" >
      Dodaj kanał
    </StyledButton >


  </StyledForm>
}

const TextInput = styled.input({
  display: "block",
  marginTop: "5px",
  marginBottom: "15px",
  maxWidth: "90%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",

})

const SelectInput = styled.select({
  display: "block",
  marginTop: "5px",
  marginBottom: "15px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
})

const StyledForm = styled.form({
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px",
})

