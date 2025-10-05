import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "es2020",
  clean: true,
  bundle: true,
  noExternal: ["@lafineequipe/db", "@lafineequipe/types"],
  sourcemap: false,
  minify: false,
});
