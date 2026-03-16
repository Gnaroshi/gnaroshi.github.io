import path from "node:path";
import { promises as fs } from "node:fs";
import {
  CONTENT_DIR,
  NEWS_CONTENT_DIR,
  PHOTOS_CONTENT_DIR,
  PHOTOS_RAW_DIR,
  PUBLICATIONS_CONTENT_DIR,
  ensureDir,
  listMarkdownFiles,
  normalizeSlug,
  readJsonFile,
  serializeFrontmatterMarkdown,
  writeJsonFile,
} from "./lib.mjs";

const ROOT_DIR = process.cwd();
const LEGACY_NEWS_FILE = path.resolve(ROOT_DIR, "src/assets/dataset/news.json");
const LEGACY_PUBLICATION_FILES = {
  application: path.resolve(ROOT_DIR, "src/assets/dataset/application_ai.json"),
  biomedical: path.resolve(ROOT_DIR, "src/assets/dataset/biomedical_ai.json"),
  core: path.resolve(ROOT_DIR, "src/assets/dataset/core_ai.json"),
  "multi-modal": path.resolve(ROOT_DIR, "src/assets/dataset/multi-modal_ai.json"),
};
const LEGACY_PHOTO_DIR = path.resolve(ROOT_DIR, "src/assets/images/photo");

const LEGACY_PHOTO_METADATA = {
  "20241211": { title: "ACCV 2024", caption: "ACCV 2024", description: "Conference presentation", date: "2024-12-11" },
  "20241128": { title: "BMVC 2024", caption: "BMVC 2024", description: "Lab poster session", date: "2024-11-28" },
  "20241127": { title: "Winter 2024 Lab Gathering", caption: "Winter 2024 Lab Gathering", date: "2024-11-27" },
  "20240910": { title: "AIAI 2024", caption: "AIAI 2024", description: "Invited talk", date: "2024-09-10" },
  "20240826_2": { title: "August 2024 Graduation", caption: "August 2024 Graduation", date: "2024-08-26" },
  "20240826_1": { title: "Summer 2024 Mentoring Program", caption: "Summer 2024 Mentoring Program", date: "2024-08-26" },
  "20240717": { title: "Summer 2024 Team Event", caption: "Summer 2024 Team Event", date: "2024-07-17" },
  "20240222": { title: "February 2024 Graduation", caption: "February 2024 Graduation", date: "2024-02-22" },
  "20231227_2": { title: "2023 Year-end Gathering", caption: "2023 Year-end Gathering", date: "2023-12-27" },
  "20231227_1": { title: "December Lab Seminar", caption: "December Lab Seminar", date: "2023-12-27" },
  "20230822_2": { title: "August 2023 Graduation", caption: "August 2023 Graduation", date: "2023-08-22" },
  "20230822_1": { title: "August 2023 Graduation", caption: "August 2023 Graduation", date: "2023-08-22" },
  "20230609": { title: "June Lab Dinner", caption: "June Lab Dinner", date: "2023-06-09" },
};

const normalizeText = (value) => String(value ?? "").trim();

const writeMarkdown = async (dirPath, fileName, frontmatter, body = "") => {
  await ensureDir(dirPath);
  const outputPath = path.resolve(dirPath, fileName);
  const content = serializeFrontmatterMarkdown(frontmatter, body);
  await fs.writeFile(outputPath, content, "utf8");
};

const bootstrapNews = async () => {
  const existing = await listMarkdownFiles(NEWS_CONTENT_DIR);
  const contentFiles = existing.filter((filePath) => !path.basename(filePath).startsWith("_"));
  if (contentFiles.length > 0) {
    return false;
  }

  const legacyNews = (await readJsonFile(LEGACY_NEWS_FILE, { items: [] })) ?? { items: [] };
  const items = Array.isArray(legacyNews.items) ? legacyNews.items : [];

  for (const item of items) {
    const id = normalizeText(item.id) || normalizeSlug(item.title);
    if (!id) continue;
    const summary = normalizeText(item.summary) || "Update from Lab-LVM.";
    await writeMarkdown(
      NEWS_CONTENT_DIR,
      `${id}.md`,
      {
        id,
        type: normalizeText(item.type) || "general",
        title: normalizeText(item.title),
        summary,
        date: normalizeText(item.date),
        related_person: normalizeText(item.related_person),
        venue: normalizeText(item.venue),
        external_url: normalizeText(item.external_url),
        is_external: item.is_external === true,
        featured: item.featured === true,
        internal_slug: normalizeText(item.internal_slug) || normalizeSlug(id),
      },
      summary,
    );
  }

  return true;
};

const bootstrapPublications = async () => {
  const existing = await listMarkdownFiles(PUBLICATIONS_CONTENT_DIR);
  const contentFiles = existing.filter((filePath) => !path.basename(filePath).startsWith("_"));
  if (contentFiles.length > 0) {
    return false;
  }

  for (const [category, filePath] of Object.entries(LEGACY_PUBLICATION_FILES)) {
    const dataset = (await readJsonFile(filePath, {})) ?? {};
    const publishedEntries = Object.entries(dataset.published ?? {});

    for (const [legacyKey, entry] of publishedEntries) {
      const meta = entry?.research_meta ?? {};
      const title = normalizeText(entry?.title);
      if (!title) continue;
      const id = normalizeSlug(`${category}-${legacyKey}-${title.slice(0, 42)}`);
      const summary = normalizeText(entry?.content?.solve) || "";

      await writeMarkdown(
        path.resolve(PUBLICATIONS_CONTENT_DIR, category),
        `${id}.md`,
        {
          id,
          category,
          status: "published",
          title,
          date: normalizeText(meta.published_date),
          authors: normalizeText(meta.author),
          venue: normalizeText(meta.published_place),
          paper_url: normalizeText(meta.paper_link),
          source_code_url: normalizeText(meta.source_code_link),
          featured: false,
          summary,
        },
        summary,
      );
    }
  }

  return true;
};

const bootstrapPhotos = async () => {
  const rawPhotos = await fs.readdir(PHOTOS_RAW_DIR, { withFileTypes: true }).catch(() => []);
  const hasImageLikeEntry = rawPhotos.some((entry) => {
    if (entry.name.startsWith(".")) {
      return false;
    }
    return entry.isDirectory() || entry.isFile();
  });
  if (hasImageLikeEntry) {
    return false;
  }

  const targetDir = path.resolve(PHOTOS_RAW_DIR, "events", "2024-01-01__legacy-archive");
  await ensureDir(targetDir);

  const legacyEntries = await fs.readdir(LEGACY_PHOTO_DIR, { withFileTypes: true });
  for (const entry of legacyEntries) {
    if (!entry.isFile()) continue;
    if (entry.name === "photo_image_index.jsx") continue;
    if (entry.name.toLowerCase().includes("thumb")) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    const sourcePath = path.resolve(LEGACY_PHOTO_DIR, entry.name);
    const targetPath = path.resolve(targetDir, entry.name);
    await fs.copyFile(sourcePath, targetPath);
  }

  await ensureDir(PHOTOS_CONTENT_DIR);
  await writeJsonFile(path.resolve(PHOTOS_CONTENT_DIR, "metadata.json"), {
    defaults: {
      category: "events",
      description: "",
    },
    items: LEGACY_PHOTO_METADATA,
  });

  return true;
};

const run = async () => {
  await ensureDir(CONTENT_DIR);
  const newsBootstrapped = await bootstrapNews();
  const publicationBootstrapped = await bootstrapPublications();
  const photoBootstrapped = await bootstrapPhotos();

  console.log(
    `[content bootstrap] news=${newsBootstrapped ? "created" : "skipped"}, publications=${publicationBootstrapped ? "created" : "skipped"}, photos=${photoBootstrapped ? "created" : "skipped"}`,
  );
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
