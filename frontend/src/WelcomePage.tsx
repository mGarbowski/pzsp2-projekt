import { FormEvent, useState } from "react";
import { Input } from "./Components/UI/input";


export const WelcomePage = () => {
  const [message, setMessage] = useState('');
  const [length, setLength] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mode = import.meta.env.MODE;
  const modeName = mode === 'development' ? 'Development' : 'Production';
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string;

  const handleLengthSubmit = async (e: FormEvent) => {
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
        setError('Failed to fetch message length');
      }

      const data = await response.json();
      setLength(data.length);
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center' }}>
      <h1>PZSP2 Projekt</h1>
      <p>Build: {modeName}</p>
      <p>Backend base URL: {backendBaseUrl}</p>

      <form onSubmit={handleLengthSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
          style={{ marginBottom: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px', margin: '0px 0px 20px 0px' }}>Get Message Length</button>
      </form>
      {length !== 0 && <p>Length: {length}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
