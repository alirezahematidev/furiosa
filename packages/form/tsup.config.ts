import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const external = ['react', 'react-dom', 'zod', 'ulidx', '@legendapp/state', '@legendapp/state/react'];

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
    hooks: path.resolve(__dirname, 'src/hooks/index.ts'),
    components: path.resolve(__dirname, 'src/components/index.ts'),
    tools: path.resolve(__dirname, 'src/tools/index.ts'),
  },
  format: ['esm'],
  external,
  dts: true,
  treeshake: true,
  splitting: false,
  clean: true,
  minify: true,
  platform: 'browser',
});
