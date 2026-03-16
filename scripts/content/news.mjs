import path from "node:path";
import { promises as fs } from "node:fs";
import {
  NEWS_CONTENT_DIR,
  NEWS_GENERATED_FILE,
  getNowIso,
  isIsoDate,
  listMarkdownFiles,
  normalizeHttpUrl,
  normalizeSlug,
  parseMarkdownFrontmatter,
  relativeFromRoot,
  toYear,
  writeJsonFile,
} from "./lib.mjs";

const NEWS_TYPES = new Set([
  "paper_accepted",
  "equipment",
  "new_member",
  "graduation",
  "seminar",
  "award",
  "visit",
  "workshop",
  "general",
]);

const TYPE_LABELS = {
  paper_accepted: "Paper Accepted",
  equipment: "Equipment",
  new_member: "New Member",
  graduation: "Graduation",
  seminar: "Seminar / Talk",
  award: "Award",
  visit: "Visit / Collaboration",
  workshop: "Workshop",
  general: "General Update",
};

const normalizeText = (value) => String(value ?? "").trim();

const requiredError = (filePath, fieldName, message = "is required") =>
  `[news] ${relativeFromRoot(filePath)}: "${fieldName}" ${message}`;

const validateType = (value, filePath) => {
  const type = normalizeText(value);
  if (!type) {
    throw new Error(requiredError(filePath, "type"));
  }
  if (!NEWS_TYPES.has(type)) {
    throw new Error(
      `[news] ${relativeFromRoot(filePath)}: unsupported type "${type}". Allowed: ${Array.from(NEWS_TYPES).join(", ")}`,
    );
  }
  return type;
};

const parseNewsFile = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, body } = parseMarkdownFrontmatter(raw, filePath);
  const id = normalizeText(data.id) || normalizeSlug(path.basename(filePath, ".md"));
  const title = normalizeText(data.title);
  const date = normalizeText(data.date);
  const type = validateType(data.type, filePath);
  const summary = normalizeText(data.summary) || body.split("\n")[0]?.trim() || "";
  const venue = normalizeText(data.venue);
  const relatedPerson = normalizeText(data.related_person);
  const externalUrl = normalizeHttpUrl(data.external_url);
  const internalSlug = normalizeText(data.internal_slug) || normalizeSlug(id || title);
  const isExternal = data.is_external === true || Boolean(externalUrl);
  const featured = data.featured === true;

  if (!id) {
    throw new Error(requiredError(filePath, "id"));
  }
  if (!title) {
    throw new Error(requiredError(filePath, "title"));
  }
  if (!date) {
    throw new Error(requiredError(filePath, "date"));
  }
  if (!isIsoDate(date)) {
    throw new Error(
      `[news] ${relativeFromRoot(filePath)}: "date" must be YYYY-MM-DD (received "${date}")`,
    );
  }
  if (!summary) {
    throw new Error(requiredError(filePath, "summary"));
  }
  if (isExternal && !externalUrl) {
    throw new Error(
      `[news] ${relativeFromRoot(filePath)}: external item requires a valid "external_url"`,
    );
  }

  return {
    id,
    type,
    title,
    summary,
    date,
    year: toYear(date),
    related_person: relatedPerson,
    venue,
    external_url: externalUrl,
    internal_slug: internalSlug,
    is_external: isExternal,
    featured,
  };
};

export const syncNewsContent = async ({ validateOnly = false } = {}) => {
  const markdownFiles = (await listMarkdownFiles(NEWS_CONTENT_DIR)).filter(
    (filePath) => !path.basename(filePath).startsWith("_"),
  );

  if (markdownFiles.length === 0) {
    throw new Error(
      `[news] No markdown files found in ${relativeFromRoot(NEWS_CONTENT_DIR)}. Add content before syncing.`,
    );
  }

  const items = [];
  const seenIds = new Set();

  for (const filePath of markdownFiles) {
    const item = await parseNewsFile(filePath);
    if (seenIds.has(item.id)) {
      throw new Error(`[news] Duplicate id "${item.id}" in ${relativeFromRoot(filePath)}`);
    }
    seenIds.add(item.id);
    items.push(item);
  }

  items.sort((a, b) => {
    if (a.date === b.date) {
      return a.id.localeCompare(b.id);
    }
    return b.date.localeCompare(a.date);
  });

  if (validateOnly) {
    console.log(`[news] validated ${items.length} entries`);
    return items;
  }

  await writeJsonFile(NEWS_GENERATED_FILE, {
    meta: {
      schema_version: "4.0",
      generated_at: getNowIso(),
      default_sort: "date_desc",
      source: "content/news",
      type_labels: TYPE_LABELS,
    },
    items,
  });

  console.log(
    `[news] synced ${items.length} entries -> ${relativeFromRoot(NEWS_GENERATED_FILE)}`,
  );

  return items;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const validateOnly = process.argv.includes("--validate-only");
  syncNewsContent({ validateOnly }).catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}
