import { defineConfig, UserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  mode: 'test',
  plugins: [tsconfigPaths()] as UserConfig['plugins'],
  publicDir: false,
  test: {
    include: ['**/__tests__/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
