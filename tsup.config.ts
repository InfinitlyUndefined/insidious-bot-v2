import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  clean: true,
  dts: false,
  entry: ["src/index.ts"],
  target: "esnext",
  tsconfig: "tsconfig.json",
  format: "esm",
  minify: true,
  splitting: true,
  outDir: "dist",
  sourcemap: true,
  shims: true,
  platform: "node",
  skipNodeModulesBundle: true,
});
