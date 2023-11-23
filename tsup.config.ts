import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  shims: false,
  outDir: "dist",
  entry: ["src/index.ts", "src/**/*.ts"],
  dts: false,
  cjsInterop: true,
  format: ["esm"],
  keepNames: true,
  sourcemap: true,
  target: "esnext",
  minify: true,
  skipNodeModulesBundle: true,
  splitting: true,
  tsconfig: "tsconfig.json",
});
