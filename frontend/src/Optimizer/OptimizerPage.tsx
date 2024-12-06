import {useState} from "react";
import {useOptimizer} from "./useOptimizer.ts";

export const OptimizerPage = () => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
  const url = `${backendBaseUrl}/ws/optimizer`;
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);

  const isDisconnectMessage = (msg: string) => msg.startsWith("Optimization finished");

  const {sendQuery, lastMessage} = useOptimizer(url, isDisconnectMessage);

  return <div>
    <h1>Optimizer</h1>
    <h2>Minimize ax+yb, where 3x+2y &ge; 1 </h2>
    <input
      type="text"
      value={a}
      onChange={(e) => setA(parseInt(e.target.value))}
      placeholder="Enter the a parameter"
      required
      style={{marginBottom: '10px', padding: '5px'}}
    />
    <input
      type="text"
      value={b}
      onChange={(e) => setB(parseInt(e.target.value))}
      placeholder="Enter the b parameter"
      required
      style={{marginBottom: '10px', padding: '5px'}}
    />
    <button onClick={() => sendQuery(JSON.stringify({a, b}))}>Optimize</button>
    <p>Message: {lastMessage}</p>
  </div>
}
