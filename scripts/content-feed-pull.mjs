import { existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPOSITORY = "https://github.com/Gnaroshi/gnaroshi-content-feed.git";
const target = resolve(process.env.CONTENT_FEED_PATH || ".content-feed");
const refIndex = process.argv.indexOf("--ref");
const ref = refIndex >= 0 ? process.argv[refIndex + 1] : (process.env.CONTENT_FEED_REF || "main");

if (!ref || ref.startsWith("-")) {
  throw new Error("[content-feed] --ref requires a branch, tag, or commit value.");
}
if (target === process.cwd()) {
  throw new Error("[content-feed] CONTENT_FEED_PATH must not point to the website repository root.");
}

function git(args, options = {}) {
  return execFileSync("git", args, { encoding: "utf8", stdio: options.capture ? "pipe" : "inherit" });
}

if (!existsSync(target)) {
  mkdirSync(dirname(target), { recursive: true });
  git(["clone", "--filter=blob:none", "--no-checkout", REPOSITORY, target]);
  git(["-C", target, "fetch", "--prune", "origin", ref]);
  git(["-C", target, "checkout", "--detach", "FETCH_HEAD"]);
} else {
  if (!existsSync(resolve(target, ".git"))) {
    throw new Error(`[content-feed] ${target} exists but is not a git checkout.`);
  }
  const status = git(["-C", target, "status", "--porcelain"], { capture: true }).trim();
  if (status) {
    throw new Error("[content-feed] checkout has local changes; refusing to fetch or merge.");
  }
  git(["-C", target, "fetch", "--prune", "origin", ref]);
  git(["-C", target, "merge", "--ff-only", "FETCH_HEAD"]);
}

const checkScript = fileURLToPath(new URL("./content-feed-check.mjs", import.meta.url));
execFileSync(process.execPath, [checkScript], {
  stdio: "inherit",
  env: { ...process.env, CONTENT_FEED_PATH: target }
});

const commit = git(["-C", target, "rev-parse", "HEAD"], { capture: true }).trim();
console.log(`[content-feed] ready at ${target} (${commit})`);
