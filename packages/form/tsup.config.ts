import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsup'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const external = ['react', 'react/jsx-runtime', 'react-dom', 'zod', 'ulidx', '@legendapp/state', '@legendapp/state/react']

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
  },
  format: ['esm'],
  external,
  dts: true,
  treeshake: true,
  splitting: false,
  clean: true,
  minify: true,
})
