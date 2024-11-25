import './App.css'

function App() {
  const mode = import.meta.env.MODE;
  const modeName = mode === 'development' ? 'Development' : 'Production';
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto', placeItems: 'center'}}>
      <h1>PZSP2 Projekt</h1>
      <p>Build: {modeName}</p>
    </div>
  )
}

export default App
