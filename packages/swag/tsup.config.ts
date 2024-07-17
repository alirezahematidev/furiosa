import path from "path";
import { defineConfig } from "tsup";
import fs from "fs-extra";

const pkg = fs.readJSONSync(path.resolve(__dirname, "package.json"), { encoding: "utf8" });

export default defineConfig({
  entry: {
    main: path.resolve(__dirname, "src/index.mts"),
  },
  clean: true,
  dts: true,
  minify: true,
  format: ["esm"],
  treeshake: true,
  splitting: false,
  external: Object.keys(pkg.dependencies),
});
