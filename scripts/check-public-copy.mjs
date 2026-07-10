import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "dist");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
const forbidden = [
  { label: "placeholder", pattern: /placeholder/i },
  { label: "sample", pattern: /sample/i },
  { label: "example:", pattern: /example:/i },
  { label: "todo", pattern: /todo/i },
  { label: "editable in", pattern: /editable\s+in/i },
  { label: "src/data", pattern: /src\/data/i },
  { label: "to be updated", pattern: /to\s+be\s+updated/i },
  { label: "lorem ipsum", pattern: /lorem\s+ipsum/i }
];
const today = getTodayKey();

let files;
try {
  files = await collectTextFiles(outputDirectory);
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    console.error("dist/ does not exist. Run npm run build before checking public copy.");
    process.exit(1);
  }
  throw error;
}

const findings = [];
for (const file of files) {
  const content = await readFile(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(content)) {
      findings.push({ file: path.relative(root, file), term: rule.label });
    }
  }
  const futureDates = [...new Set(content.match(/\b20\d{2}-\d{2}-\d{2}\b/g) ?? [])].filter((date) => date > today);
  for (const date of futureDates) {
    findings.push({ file: path.relative(root, file), term: `future date ${date}` });
  }
}

if (findings.length > 0) {
  console.error("Public copy check failed:");
  for (const finding of findings) console.error(`- ${finding.file}: contains \"${finding.term}\"`);
  process.exit(1);
}

console.log(`Public copy check passed (${files.length} built text files scanned).`);

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(target);
    return textExtensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return nested.flat();
}

function getTodayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");
}
