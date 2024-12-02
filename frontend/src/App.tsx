import React, { useState } from 'react';
import './App.css';
import {Optimizer} from "./Optimizer/Optimizer.tsx";

function App() {
  const [message, setMessage] = useState('');
  const [length, setLength] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mode = import.meta.env.MODE;
  const modeName = mode === 'development' ? 'Development' : 'Production';
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLength(null);

    try {
      const response = await fetch(`${backendBaseUrl}/message-length`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLength(data.length);
    } catch (error) {
      setError('Failed to fetch message length');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center' }}>
      <h1>PZSP2 Projekt</h1>
      <p>Build: {modeName}</p>
      <p>Backend base URL: {backendBaseUrl}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Get Message Length</button>
      </form>
      {length !== null && <p>Message Length: {length}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Optimizer/>
    </div>
  );
}

export default App;