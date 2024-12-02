import {useState} from "react";
import useWebSocket from "react-use-websocket";

export const Optimizer = () => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
  const url = `${backendBaseUrl}/ws/optimizer`;

  const [message, setMessage] = useState('');

  const {sendMessage, lastMessage} = useWebSocket(url);

  const handleClick = () => {
    sendMessage(message);
  }

  return <div>
    <input type="text" placeholder="Enter your message"
      onChange={(e) => setMessage(e.target.value)}/>
    <button onClick={handleClick}>Optimize</button>
    <p>Message: {lastMessage?.data}</p>
  </div>
}