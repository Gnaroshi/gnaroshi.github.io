import path from "node:path";
import { promises as fs } from "node:fs";
import {
  PHOTOS_CONTENT_DIR,
  PHOTOS_GENERATED_FILE,
  PHOTOS_METADATA_FILE,
  PHOTOS_RAW_DIR,
  PHOTO_UPLOADS_DIR,
  commandExists,
  ensureDir,
  getNowIso,
  inferDateFromText,
  isIsoDate,
  listImageFiles,
  normalizeSlug,
  pathExists,
  readJsonFile,
  relativeFromRoot,
  runCommand,
  writeJsonFile,
} from "./lib.mjs";

const THUMB_MAX = 720;
const LARGE_MAX = 2200;
const LARGE_QUALITY = 82;
const THUMB_QUALITY = 74;

const normalizeText = (value) => String(value ?? "").trim();

const toPosixPath = (value) => value.split(path.sep).join("/");

const slugToTitle = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const parseOrderFromFileName = (fileName) => {
  const match = fileName.match(/(?:_|-)(\d{1,3})$/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) || 0;
};

const resolvePhotoMetadata = (metadataMap, relativePath, baseName) => {
  if (!metadataMap || typeof metadataMap !== "object") {
    return {};
  }

  const byRelative = metadataMap[relativePath];
  if (byRelative && typeof byRelative === "object") {
    return byRelative;
  }

  const byBaseName = metadataMap[baseName];
  if (byBaseName && typeof byBaseName === "object") {
    return byBaseName;
  }

  return {};
};

const parseFolderDateSlug = (folderName) => {
  const match = folderName.match(/^(\d{4}-\d{2}-\d{2})__(.+)$/);
  if (!match) {
    return { date: null, slug: null };
  }

  return {
    date: match[1],
    slug: normalizeSlug(match[2]),
  };
};

const getOutputPaths = (category, date, slug, baseName) => {
  const safeCategory = normalizeSlug(category) || "general";
  const safeSlug = normalizeSlug(slug) || "untitled";
  const safeDate = isIsoDate(date) ? date : "1970-01-01";
  const safeBaseName = normalizeSlug(baseName) || "photo";

  const outputDir = path.resolve(PHOTO_UPLOADS_DIR, safeCategory, `${safeDate}__${safeSlug}`);
  const largeFileName = `${safeBaseName}--large.jpg`;
  const thumbFileName = `${safeBaseName}--thumb.jpg`;

  const largeAbsolutePath = path.resolve(outputDir, largeFileName);
  const thumbAbsolutePath = path.resolve(outputDir, thumbFileName);

  return {
    outputDir,
    largeAbsolutePath,
    thumbAbsolutePath,
    largeRelativePath: toPosixPath(path.relative(path.resolve(process.cwd(), "public"), largeAbsolutePath)),
    thumbRelativePath: toPosixPath(path.relative(path.resolve(process.cwd(), "public"), thumbAbsolutePath)),
  };
};

const createImageProcessor = async () => {
  const hasMagick = await commandExists("magick");
  if (hasMagick) {
    return {
      id: "magick",
      resize: (input, output, maxSize, quality) =>
        runCommand("magick", [
          input,
          "-auto-orient",
          "-strip",
          "-resize",
          `${maxSize}x${maxSize}>`,
          "-quality",
          String(quality),
          output,
        ]),
      dimensions: async (targetPath) => {
        const { stdout } = await runCommand("magick", [
          "identify",
          "-format",
          "%w %h",
          targetPath,
        ]);
        const [widthText, heightText] = stdout.split(/\s+/);
        return {
          width: Number.parseInt(widthText, 10) || 0,
          height: Number.parseInt(heightText, 10) || 0,
        };
      },
    };
  }

  const hasConvert = await commandExists("convert");
  const hasIdentify = await commandExists("identify");
  if (hasConvert && hasIdentify) {
    return {
      id: "imagemagick",
      resize: (input, output, maxSize, quality) =>
        runCommand("convert", [
          input,
          "-auto-orient",
          "-strip",
          "-resize",
          `${maxSize}x${maxSize}>`,
          "-quality",
          String(quality),
          output,
        ]),
      dimensions: async (targetPath) => {
        const { stdout } = await runCommand("identify", ["-format", "%w %h", targetPath]);
        const [widthText, heightText] = stdout.split(/\s+/);
        return {
          width: Number.parseInt(widthText, 10) || 0,
          height: Number.parseInt(heightText, 10) || 0,
        };
      },
    };
  }

  const hasSips = await commandExists("sips");
  if (hasSips) {
    return {
      id: "sips",
      resize: (input, output, maxSize, quality) =>
        runCommand("sips", [
          "-s",
          "format",
          "jpeg",
          "-s",
          "formatOptions",
          String(quality),
          "--resampleHeightWidthMax",
          String(maxSize),
          input,
          "--out",
          output,
        ]),
      dimensions: async (targetPath) => {
        const { stdout } = await runCommand("sips", [
          "-g",
          "pixelWidth",
          "-g",
          "pixelHeight",
          targetPath,
        ]);
        const widthMatch = stdout.match(/pixelWidth:\s*(\d+)/);
        const heightMatch = stdout.match(/pixelHeight:\s*(\d+)/);
        return {
          width: Number.parseInt(widthMatch?.[1] ?? "0", 10),
          height: Number.parseInt(heightMatch?.[1] ?? "0", 10),
        };
      },
    };
  }

  return null;
};

const processImageFiles = async (files, metadataMap, defaults, validateOnly) => {
  const processor = validateOnly ? null : await createImageProcessor();
  if (!validateOnly && !processor) {
    throw new Error(
      "[photos] No image processor found. Install ImageMagick (magick/convert) or run on macOS with sips.",
    );
  }

  const items = [];

  for (const [index, filePath] of files.entries()) {
    const relativePath = toPosixPath(path.relative(PHOTOS_RAW_DIR, filePath));
    const baseName = path.basename(filePath, path.extname(filePath));
    const pathParts = relativePath.split("/");
    const maybeCategory = pathParts.length >= 2 ? pathParts[0] : "general";
    const maybeDateSlugFolder = pathParts.length >= 3 ? pathParts[1] : "";
    const { date: folderDate, slug: folderSlug } = parseFolderDateSlug(maybeDateSlugFolder);

    const metadata = resolvePhotoMetadata(metadataMap, relativePath, baseName);
    const inferredDate =
      normalizeText(metadata.date) ||
      folderDate ||
      inferDateFromText(baseName) ||
      inferDateFromText(relativePath) ||
      normalizeText(defaults?.date) ||
      "1970-01-01";

    if (!isIsoDate(inferredDate)) {
      throw new Error(
        `[photos] ${relativeFromRoot(filePath)}: date must resolve to YYYY-MM-DD (received "${inferredDate}")`,
      );
    }

    const inferredSlug =
      normalizeSlug(metadata.slug) ||
      folderSlug ||
      normalizeSlug(baseName.replace(/^\d{8}[_-]?/, "")) ||
      `photo-${index + 1}`;
    const inferredCategory = normalizeSlug(metadata.category || maybeCategory || defaults?.category) || "general";
    const inferredOrder =
      Number.isFinite(Number(metadata.order)) ? Number(metadata.order) : parseOrderFromFileName(baseName);
    const inferredTitle =
      normalizeText(metadata.title) ||
      normalizeText(metadata.caption) ||
      slugToTitle(inferredSlug);
    const inferredDescription = normalizeText(metadata.description || defaults?.description);
    const inferredCaption = normalizeText(metadata.caption) || inferredTitle;
    const inferredAlt = normalizeText(metadata.alt) || inferredCaption;

    const outputPaths = getOutputPaths(
      inferredCategory,
      inferredDate,
      inferredSlug,
      `${baseName}-${String(index + 1).padStart(2, "0")}`,
    );

    if (!validateOnly) {
      await ensureDir(outputPaths.outputDir);
      await processor.resize(filePath, outputPaths.largeAbsolutePath, LARGE_MAX, LARGE_QUALITY);
      await processor.resize(filePath, outputPaths.thumbAbsolutePath, THUMB_MAX, THUMB_QUALITY);
    }

    let dimensions = { width: 0, height: 0 };
    if (await pathExists(outputPaths.largeAbsolutePath)) {
      const dimensionReader = processor || (await createImageProcessor());
      if (dimensionReader) {
        dimensions = await dimensionReader.dimensions(outputPaths.largeAbsolutePath);
      }
    }

    const id = `${inferredDate}-${inferredSlug}-${String(Math.max(0, inferredOrder)).padStart(2, "0")}`;
    items.push({
      id,
      category: inferredCategory,
      date: inferredDate,
      slug: inferredSlug,
      order: Math.max(0, inferredOrder),
      title: inferredTitle,
      caption: inferredCaption,
      description: inferredDescription,
      alt: inferredAlt,
      thumbnail: outputPaths.thumbRelativePath,
      full: outputPaths.largeRelativePath,
      width: dimensions.width,
      height: dimensions.height,
      source: relativePath,
    });
  }

  items.sort((a, b) => {
    if (a.date === b.date) {
      if (a.order === b.order) {
        return a.id.localeCompare(b.id);
      }
      return a.order - b.order;
    }
    return b.date.localeCompare(a.date);
  });

  return items;
};

export const syncPhotoContent = async ({ validateOnly = false } = {}) => {
  const imageFiles = await listImageFiles(PHOTOS_RAW_DIR);
  if (imageFiles.length === 0) {
    throw new Error(
      `[photos] No image files found in ${relativeFromRoot(PHOTOS_RAW_DIR)}. Add raw photos first.`,
    );
  }

  const metadata = (await readJsonFile(PHOTOS_METADATA_FILE, {})) ?? {};
  const metadataItems = metadata.items ?? {};
  const defaults = metadata.defaults ?? {};

  const items = await processImageFiles(imageFiles, metadataItems, defaults, validateOnly);

  if (validateOnly) {
    console.log(`[photos] validated ${items.length} entries`);
    return items;
  }

  await writeJsonFile(PHOTOS_GENERATED_FILE, {
    meta: {
      schema_version: "1.0",
      generated_at: getNowIso(),
      source: "content/photos/raw",
      output_dir: "public/uploads/photos",
      sizes: {
        thumb_max: THUMB_MAX,
        large_max: LARGE_MAX,
      },
    },
    items,
  });

  console.log(
    `[photos] synced ${items.length} entries -> ${relativeFromRoot(PHOTOS_GENERATED_FILE)}`,
  );
  return items;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const validateOnly = process.argv.includes("--validate-only");
  syncPhotoContent({ validateOnly }).catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}

