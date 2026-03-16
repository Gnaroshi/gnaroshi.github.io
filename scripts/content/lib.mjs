import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const ROOT_DIR = process.cwd();
export const CONTENT_DIR = path.resolve(ROOT_DIR, "content");
export const GENERATED_DIR = path.resolve(ROOT_DIR, "src/generated");
export const PUBLIC_DIR = path.resolve(ROOT_DIR, "public");

export const NEWS_CONTENT_DIR = path.resolve(CONTENT_DIR, "news");
export const PUBLICATIONS_CONTENT_DIR = path.resolve(CONTENT_DIR, "publications");
export const PHOTOS_CONTENT_DIR = path.resolve(CONTENT_DIR, "photos");
export const PHOTOS_RAW_DIR = path.resolve(PHOTOS_CONTENT_DIR, "raw");
export const PHOTOS_METADATA_FILE = path.resolve(PHOTOS_CONTENT_DIR, "metadata.json");
export const PHOTO_UPLOADS_DIR = path.resolve(PUBLIC_DIR, "uploads/photos");

export const NEWS_GENERATED_FILE = path.resolve(GENERATED_DIR, "news.generated.json");
export const PUBLICATIONS_GENERATED_FILE = path.resolve(
  GENERATED_DIR,
  "publications.generated.json",
);
export const PHOTOS_GENERATED_FILE = path.resolve(GENERATED_DIR, "photos.generated.json");

export const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const ensureDir = async (targetDir) => {
  await fs.mkdir(targetDir, { recursive: true });
};

export const pathExists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

export const readJsonFile = async (filePath, fallback = null) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJsonFile = async (filePath, data) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const FRONTMATTER_BOUNDARY = "---";

const parseArrayValue = (rawValue) => {
  const inner = rawValue.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  return inner
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((value) => parseScalarValue(value));
};

const parseScalarValue = (rawValue) => {
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  if (rawValue === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(rawValue)) return Number(rawValue);
  if (rawValue.startsWith("[") && rawValue.endsWith("]")) return parseArrayValue(rawValue);
  if (
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
  ) {
    return rawValue.slice(1, -1);
  }

  return rawValue;
};

export const parseMarkdownFrontmatter = (rawContent, filePath) => {
  if (!rawContent.startsWith(`${FRONTMATTER_BOUNDARY}\n`)) {
    return {
      data: {},
      body: rawContent.trim(),
    };
  }

  const closingMarker = `\n${FRONTMATTER_BOUNDARY}\n`;
  const closingIndex = rawContent.indexOf(closingMarker, FRONTMATTER_BOUNDARY.length + 1);

  if (closingIndex === -1) {
    throw new Error(`Invalid frontmatter block in ${filePath}`);
  }

  const frontmatterBlock = rawContent
    .slice(FRONTMATTER_BOUNDARY.length + 1, closingIndex)
    .trim();
  const body = rawContent
    .slice(closingIndex + closingMarker.length)
    .trim();

  const data = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex <= 0) {
      throw new Error(`Invalid frontmatter line "${line}" in ${filePath}`);
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    data[key] = parseScalarValue(rawValue);
  });

  return { data, body };
};

const serializeValue = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeValue(item)).join(", ")}]`;
  }

  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  const text = String(value);
  if (text.length === 0) {
    return '""';
  }

  if (/^[a-zA-Z0-9._/-]+$/.test(text)) {
    return text;
  }

  return JSON.stringify(text);
};

export const serializeFrontmatterMarkdown = (data, body = "") => {
  const lines = Object.entries(data).map(([key, value]) => `${key}: ${serializeValue(value)}`);
  return `${FRONTMATTER_BOUNDARY}\n${lines.join("\n")}\n${FRONTMATTER_BOUNDARY}\n\n${body.trim()}\n`;
};

export const listMarkdownFiles = async (rootDir) => {
  const files = [];

  if (!(await pathExists(rootDir))) {
    return files;
  }

  const walk = async (currentDir) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    const sortedEntries = [...entries].sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of sortedEntries) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      const absolutePath = path.resolve(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        files.push(absolutePath);
      }
    }
  };

  await walk(rootDir);
  return files;
};

export const listImageFiles = async (rootDir) => {
  const files = [];

  if (!(await pathExists(rootDir))) {
    return files;
  }

  const walk = async (currentDir) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    const sortedEntries = [...entries].sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of sortedEntries) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      const absolutePath = path.resolve(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        files.push(absolutePath);
      }
    }
  };

  await walk(rootDir);
  return files;
};

export const normalizeSlug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));

export const inferDateFromText = (value) => {
  const raw = String(value ?? "");
  const ymdDashed = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (ymdDashed) {
    return `${ymdDashed[1]}-${ymdDashed[2]}-${ymdDashed[3]}`;
  }

  const ymdCompact = raw.match(/(20\d{2})(\d{2})(\d{2})/);
  if (ymdCompact) {
    return `${ymdCompact[1]}-${ymdCompact[2]}-${ymdCompact[3]}`;
  }

  return null;
};

export const normalizeHttpUrl = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";

  try {
    const parsed = new URL(text);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
};

export const toYear = (isoDate) => Number.parseInt(String(isoDate).slice(0, 4), 10);

export const getNowIso = () => new Date().toISOString();

export const runCommand = async (command, args, opts = {}) => {
  const { stdout, stderr } = await execFileAsync(command, args, opts);
  return { stdout: stdout?.trim() ?? "", stderr: stderr?.trim() ?? "" };
};

export const commandExists = async (command) => {
  try {
    await runCommand("which", [command]);
    return true;
  } catch {
    return false;
  }
};

export const relativeFromRoot = (targetPath) => path.relative(ROOT_DIR, targetPath);

