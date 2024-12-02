import {useState} from "react";
import useWebSocket from "react-use-websocket";

export const Optimizer = () => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
  const url = `${backendBaseUrl}/ws/optimizer`;

  const [message, setMessage] = useState('');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const {sendMessage, readyState} = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    onMessage: (message) => {
      const msg = message.data as string;
      setLastMessage(msg);
      if (msg.startsWith("Finished")) {
        setSocketUrl(null);
      }

    },
    shouldReconnect: () => false,
  });

  const handleClick = () => {
    setSocketUrl(url);
    sendMessage(message);
  }

  return <div>
    <input type="text" placeholder="Enter your message"
      onChange={(e) => setMessage(e.target.value)}/>
    <button onClick={handleClick} >Optimize</button>
    <p>Message: {lastMessage}</p>
    <p>readyState: {readyState}</p>
  </div>
}