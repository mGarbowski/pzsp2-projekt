import {useState} from "react";
import {useOptimizer} from "./useOptimizer.ts";

export const Optimizer = () => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
  const url = `${backendBaseUrl}/ws/optimizer`;
  const [message, setMessage] = useState('');
  const {sendQuery, lastMessage} = useOptimizer(url);

  return <div>
    <input type="text" placeholder="Enter your message"
      onChange={(e) => setMessage(e.target.value)}/>
    <button onClick={() => sendQuery(message)}>Optimize</button>
    <p>Message: {lastMessage}</p>
  </div>
}