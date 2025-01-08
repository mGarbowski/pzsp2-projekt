import { useState } from "react";
import useWebSocket from "react-use-websocket";
import {Channel, Network} from "../NetworkModel/network.ts";

export interface OptimizerRequest {
  network: Network;
  source: string;
  target: string;
  bandwidth: string;
  optimizer: string;
  distanceWeight: number;
  evenLoadWeight: number;
}

type OptimizerSuccessResponse = {
  type: "Success";
  channel: Channel;
  message?: string;
  time: number;
}

type OptimizerErrorResponse = {
  type: "Failure";
  message: string;
  time: number;
}

export type OptimizerResponse = OptimizerSuccessResponse | OptimizerErrorResponse;

export const useOptimizer = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const apiUrl = `${apiBaseUrl}/ws/optimizer`;

  const handleOpen = () => console.log("WebSocket connection opened.");

  const handleClose = () => console.log("WebSocket connection closed.");

  const handleMessage = (message: { data: string }) => {
    const msg = message.data as string;
    setResponse(msg);
    setSocketUrl(null);
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: handleOpen,
    onClose: handleClose,
    onMessage: handleMessage,
    shouldReconnect: () => false,
  });

  const sendRequest = (message: string) => {
    setSocketUrl(apiUrl);
    sendMessage(message);
  };

  return { sendRequest: sendRequest, response: response };
};

