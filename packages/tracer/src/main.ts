function createBridge() {
  if (process.env.NODE_ENV !== 'development') return;

  if (typeof window === 'undefined') throw new Error('[tracer] The form tracer only works on client side.');

  const bridge = window.__FURIOSA_TRACER_GLOBAL_WS || new WebSocket('ws://localhost:50006');

  window.__FURIOSA_TRACER_GLOBAL_WS = bridge;

  console.info('\x1b[36m%s\x1b[0m', 'Form tracer bridge is connected.');

  function trace<T>(data: T) {
    bridge.send(JSON.stringify(data));
  }

  return trace;
}

export { createBridge };
