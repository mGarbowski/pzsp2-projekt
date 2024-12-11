import React, { useState } from "react"
import styled from '@emotion/styled'
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input";


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
      <Input
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
      <Input
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
      <Select
        value={bandwidth || ""}
        onValueChange={(value: string) => setBandwidth(value)}
        required
        className="block mt-1.5 mb-3 w-full px-2 py-2 border border-gray-300 rounded-md"
      >
        <SelectTrigger aria-label="Bandwidth">
          <SelectValue placeholder="Wybierz opcję" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10Gb/s">10Gb/s</SelectItem>
          <SelectItem value="40Gb/s">40Gb/s</SelectItem>
          <SelectItem value="100Gb/s">100Gb/s</SelectItem>
          <SelectItem value="400Gb/s">400Gb/s</SelectItem>
        </SelectContent>
      </Select>
    </label>

    <label>
      Optymalizator
      <Select
        value={optimizer || ""}
        onValueChange={(value: string) => setOptimizer(value)}
        required
        className="block mt-1.5 mb-3 w-full px-2 py-2 border border-gray-300 rounded-md"
      >
        <SelectTrigger aria-label="Optimizer">
          <SelectValue placeholder="Select optimizer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dijkstra">Algorytm Dijkstry</SelectItem>
          <SelectItem value="integer">Model całkowitoliczbowy</SelectItem>
        </SelectContent>
      </Select>
    </label>

    <Button type="submit" >
      Dodaj kanał
    </Button >


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


const StyledForm = styled.form({
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px",
})

