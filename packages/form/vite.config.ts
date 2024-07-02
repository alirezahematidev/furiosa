import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import dts from "vite-plugin-dts";
import { minify } from "rollup-plugin-esbuild";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  mode: "production",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: (format, name) => `${name}.${format}.js`,
    },
    rollupOptions: {
      plugins: [minify({ minify: true })],
    },
  },
  plugins: [react(), dts({ tsconfigPath: path.resolve(__dirname, "tsconfig.json") })],
  optimizeDeps: {
    include: ["react/jsx-dev-runtime"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
