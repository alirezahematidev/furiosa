import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
    functions: path.resolve(__dirname, 'src/functions/index.ts'),
    utils: path.resolve(__dirname, 'src/utils/index.ts'),
  },
  clean: true,
  dts: true,
  minify: true,
  format: ['esm'],
  treeshake: true,
  splitting: false,
});
