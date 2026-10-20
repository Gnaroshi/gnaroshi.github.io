import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Only the canonical public-feed validator computes derived fixture identity. */
export function finalizeDerivedFixture(directory, contractRoot) {
  const manifestPath = join(directory, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const args = [join(contractRoot, "scripts", "feed-validation.mjs"), "--feed-root", directory, "--contract-root", contractRoot, "--json"];
  const measured = spawnSync(process.execPath, args, { encoding: "utf8" });
  const result = JSON.parse(measured.stdout);
  if (result.issues.some((issue) => !["content-hash", "manifest-count"].includes(issue.code))) {
    throw new Error(`Derived fixture validation failed: ${measured.stdout}\n${measured.stderr}`);
  }
  manifest.counts = result.counts;
  manifest.contentHash = result.contentHash;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const verified = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (verified.status !== 0) throw new Error(`Derived fixture validation failed: ${verified.stdout}\n${verified.stderr}`);
}
