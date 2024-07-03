import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const bridge = window.__FURIOSA_TRACER_GLOBAL_WS;

    if (!bridge) return;

    const handle = (event: MessageEvent) => {
      setMessage(JSON.stringify(event.data));
    };

    bridge.addEventListener('message', handle);

    return () => bridge.removeEventListener('message', handle);
  }, []);

  return (
    <>
      <h2>message: {message}</h2>
    </>
  );
}

export default App;
