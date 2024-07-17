import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, 'src/index.ts'),
  },
  clean: true,
  dts: true,
  minify: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  splitting: false,
});
