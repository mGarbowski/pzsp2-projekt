import { useState } from "react";
import useWebSocket from "react-use-websocket";

export const useOptimizer = (apiUrl: string, isDisconnetMessage: (msg: string) => boolean) => {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const handleOpen = () => console.log("WebSocket connection opened.");

  const handleClose = () => console.log("WebSocket connection closed.");

  const handleMessage = (message: { data: string }) => {
    const msg = message.data as string;
    setLastMessage(msg);

    if (isDisconnetMessage(msg)) {
      setSocketUrl(null);
    }
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: handleOpen,
    onClose: handleClose,
    onMessage: handleMessage,
    shouldReconnect: () => false,
  });

  const sendQuery = (message: string) => {
    setSocketUrl(apiUrl);
    sendMessage(message);
  };

  return { sendQuery, lastMessage };
};

