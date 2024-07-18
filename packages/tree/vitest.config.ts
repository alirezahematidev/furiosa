import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  mode: 'test',
  plugins: [tsconfigPaths()],
  publicDir: false,
  esbuild: {
    target: 'node18',
  },
  test: {
    include: ['**/__tests__/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
