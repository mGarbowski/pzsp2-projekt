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
import { Label } from "../components/ui/label";


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
    <Label>
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
        }}
      />
    </Label>

    <Label>
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
        }}
      />
    </Label>

    <Label>
      Przepustowość
      <Select
        value={bandwidth || ""}
        onValueChange={(value: string) => setBandwidth(value)}
        required
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
    </Label>

    <Label>
      Optymalizator
      <Select
        value={optimizer || ""}
        onValueChange={(value: string) => setOptimizer(value)}
        required
      >
        <SelectTrigger aria-label="Optimizer">
          <SelectValue placeholder="Wybierz optymalizator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dijkstra">Algorytm Dijkstry</SelectItem>
          <SelectItem value="integer">Model całkowitoliczbowy</SelectItem>
        </SelectContent>
      </Select>
    </Label>

    <Button type="submit" >
      Dodaj kanał
    </Button >


  </StyledForm>
}



const StyledForm = styled.form({
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px",
})

