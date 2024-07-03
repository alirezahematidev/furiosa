import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ exclude: /node_modules/ })],
  build: {
    outDir: 'build',
  },
});
