import React, {useEffect, useState} from "react"
import styled from '@emotion/styled'
import {Button} from "../Components/UI/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../Components/UI/select"
import {Input} from "../Components/UI/input";
import {Label} from "../Components/UI/label";
import {useNetwork} from "../NetworkModel/NetworkContext";
import {Loader2} from "lucide-react";
import {OptimizerRequest, OptimizerResponse, useOptimizer} from "./useOptimizer.ts";

interface OptimizerFormProps {
  handleResponse: (response: OptimizerResponse) => void;
}

export const OptimizerForm = (props: OptimizerFormProps) => {
  const {network} = useNetwork();
  const {sendRequest, response} = useOptimizer();

  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [bandwidth, setBandwidth] = useState<string | null>(null);
  const [optimizer, setOptimizer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [distanceWeight, setDistanceWeight] = useState<number>(1);
  const [evenLoadWeight, setEvenLoadWeight] = useState<number>(1);

  const resetForm = () => {
    setStartNode(null);
    setEndNode(null);
    setBandwidth(null);
    setOptimizer(null);
    setDistanceWeight(1);
    setEvenLoadWeight(1);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!network) {
      return;
    }

    resetForm();
    setLoading(true);

    const request: OptimizerRequest = {
      network: network,
      source: startNode!,
      target: endNode!,
      bandwidth: bandwidth!,
      optimizer: optimizer!,
      distanceWeight: distanceWeight,
      evenLoadWeight: evenLoadWeight,
    };
    sendRequest(JSON.stringify(request));
  }

  useEffect(() => {
    if (!response) {
      return;
    }

    const result = JSON.parse(JSON.parse(response!)) as OptimizerResponse;
    console.info(result);
    props.handleResponse(result);
    setLoading(false);

    // eslint-disable-next-line
  }, [response]);


  return <StyledForm onSubmit={handleSubmit}>
    <Label>
      Węzeł startowy
      <StyledTextInput
        type="text"
        placeholder="ID węzła"
        value={startNode || ""}
        onChange={(e) => setStartNode(e.target.value)}
        required={true}
      />
    </Label>

    <Label>
      Węzeł końcowy
      <StyledTextInput
        type="text"
        placeholder="ID węzła"
        required={true}
        value={endNode || ""}
        onChange={(e) => setEndNode(e.target.value)}
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
          <SelectValue placeholder="Wybierz opcję"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10Gb/s">10Gb/s</SelectItem>
          <SelectItem value="40Gb/s">40Gb/s</SelectItem>
          <SelectItem value="100Gb/s">100Gb/s</SelectItem>
          <SelectItem value="200Gb/s">200Gb/s</SelectItem>
          <SelectItem value="400Gb/s">400Gb/s</SelectItem>
          <SelectItem value="800Gb/s">800Gb/s</SelectItem>
          <SelectItem value="1000Gb/s">1000Gb/s</SelectItem>
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
          <SelectValue placeholder="Wybierz optymalizator"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dijkstra">Algorytm Dijkstry</SelectItem>
          <SelectItem value="integer">Model całkowitoliczbowy</SelectItem>
        </SelectContent>
      </Select>
    </Label>

    <Label>
      Waga długości krawędzi
      <StyledTextInput
        type="text"
        placeholder="1"
        value={distanceWeight || "1"}
        onChange={(e) => setDistanceWeight(parseInt(e.target.value))}
        required={true}
      />
    </Label>

    <Label>
      Waga obciążenia krawędzi
      <StyledTextInput
        type="text"
        placeholder="1"
        value={evenLoadWeight || "1"}
        onChange={(e) => setEvenLoadWeight(parseInt(e.target.value))}
        required={true}
      />
    </Label>

    <Button disabled={loading} variant={"outline"} type="submit" className="py-6">
      {
        loading ?
          <> < Loader2 className="animate-spin"/>Ładowanie kanału </>
          : "Dodaj kanał"
      }
    </Button>


  </StyledForm>
}


const StyledForm = styled.form({
  display: "flex",
  flexDirection: "column",
  placeContent: "center",
  marginLeft: "10px",
  marginTop: "10px",
})

const StyledTextInput = styled(Input)({
  display: "block",
  marginTop: "5px",
  marginBottom: "1rem",
  width: "100%",
  padding: "8px",
})


