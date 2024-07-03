declare global {
  interface Window {
    __FURIOSA_TRACER_GLOBAL_WS: WebSocket | null;
  }
}

export {};
