import { build } from "esbuild";

const result = await build({
  entryPoints: ["tests/public-capabilities.test.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  target: "node24",
  sourcemap: "inline"
});

const source = result.outputFiles[0].text;
await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
