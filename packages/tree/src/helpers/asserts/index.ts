export function error(method: string, message: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Warning: [Treekit:%s] %s\n', method, message);
  }
}

export function safeError(error: unknown, fallback = 'An unknown error has been occured.') {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Warning: [Treekit] %s\n', error instanceof Error ? error.message : fallback);
  }
}

export function exception(method: string, message = 'An unknown exception has been occured.') {
  return new Error(`[Treekit:${method}] ${message}`);
}

export function assertion(tree: any) {
  console.assert(typeof tree !== 'undefined' && Array.isArray(tree), '%o', { tree, errorMessage: 'Received undefined or invalid tree data' });
}
