import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
    server: path.resolve(__dirname, 'src/server.ts'),
  },
  format: ['esm'],
  external: ['express', 'ws'],
  dts: true,
  treeshake: true,
  splitting: false,
  clean: true,
  minify: true,
});
