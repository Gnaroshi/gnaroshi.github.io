import NEWS_DATA from "../assets/dataset/news.json";

const DEFAULT_NEWS_TYPE_META = {
  all: { label: "All" },
  paper_accepted: { label: "Paper Accepted" },
  equipment: { label: "Equipment" },
  new_member: { label: "New Member" },
  graduation: { label: "Graduation" },
  seminar: { label: "Seminar / Talk" },
  award: { label: "Award" },
  visit: { label: "Visit / Collaboration" },
  workshop: { label: "Workshop" },
  general: { label: "General Update" },
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeBoolean = (value) => value === true;

const parseDate = (value) => {
  const raw = normalizeText(value);
  if (!raw) {
    return new Date("1970-01-01T00:00:00");
  }

  const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? `${raw}T00:00:00`
    : raw;
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return new Date("1970-01-01T00:00:00");
  }

  return parsed;
};

const extractYear = (value, fallbackDate) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallbackDate.getFullYear();
};

const normalizeLegacyNewsItems = (items) =>
  items.map((entry, index) => {
    const item = entry?.news ?? entry ?? {};
    const parsedDate = parseDate(item.date);

    return {
      id: normalizeText(item.id) || `legacy-news-${index + 1}`,
      type: "paper_accepted",
      title: normalizeText(item.title) || "Paper Accepted",
      summary:
        normalizeText(item.summary) ||
        normalizeText(item.desc) ||
        "Publication update from Lab-LVM.",
      date: normalizeText(item.date) || "1970-01-01",
      year: extractYear(item.year, parsedDate),
      related_person: "",
      venue:
        normalizeText(item.venue) ||
        normalizeText(item.published_place) ||
        "",
      external_url:
        normalizeText(item.external_url) ||
        normalizeText(item.url) ||
        normalizeText(item.link) ||
        "",
      internal_slug: normalizeText(item.internal_slug),
      is_external: Boolean(item.url || item.link || item.external_url),
      featured: normalizeBoolean(item.featured),
      _parsedDate: parsedDate,
    };
  });

const normalizeStructuredNewsItems = (items) =>
  items.map((item, index) => {
    const parsedDate = parseDate(item?.date);
    const externalUrl = normalizeText(item?.external_url);

    return {
      id: normalizeText(item?.id) || `news-${index + 1}`,
      type: normalizeText(item?.type) || "general",
      title: normalizeText(item?.title) || "Lab Update",
      summary: normalizeText(item?.summary) || "Update from Lab-LVM.",
      date: normalizeText(item?.date) || "1970-01-01",
      year: extractYear(item?.year, parsedDate),
      related_person: normalizeText(item?.related_person),
      venue: normalizeText(item?.venue),
      external_url: externalUrl,
      internal_slug: normalizeText(item?.internal_slug),
      is_external: normalizeBoolean(item?.is_external) && Boolean(externalUrl),
      featured: normalizeBoolean(item?.featured),
      _parsedDate: parsedDate,
    };
  });

const toNewsItems = () => {
  if (Array.isArray(NEWS_DATA)) {
    return normalizeLegacyNewsItems(NEWS_DATA);
  }

  return normalizeStructuredNewsItems(NEWS_DATA?.items ?? []);
};

const typeMetaFromDataset = NEWS_DATA?.meta?.type_labels ?? {};

export const NEWS_TYPE_META = {
  ...DEFAULT_NEWS_TYPE_META,
  ...Object.entries(typeMetaFromDataset).reduce((acc, [key, label]) => {
    acc[key] = {
      label: normalizeText(label) || DEFAULT_NEWS_TYPE_META[key]?.label || key,
    };
    return acc;
  }, {}),
};

export const getNewsTypeMeta = (type) =>
  NEWS_TYPE_META[type] ?? {
    label: type
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  };

export const isValidExternalUrl = (value) => {
  const url = normalizeText(value);
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const getAllNewsItems = () =>
  toNewsItems()
    .sort((a, b) => b._parsedDate - a._parsedDate)
    .map((item) => {
      const normalizedItem = { ...item };
      delete normalizedItem._parsedDate;
      return normalizedItem;
    });

export const getLatestNewsItems = (limit = 5) => getAllNewsItems().slice(0, limit);

export const getNewsTypes = () => {
  const usedTypes = new Set(getAllNewsItems().map((item) => item.type));
  const preferredOrder = Object.keys(NEWS_TYPE_META).filter((type) => type !== "all");
  const orderedTypes = preferredOrder.filter((type) => usedTypes.has(type));
  const extraTypes = Array.from(usedTypes).filter(
    (type) => !orderedTypes.includes(type),
  );

  return ["all", ...orderedTypes, ...extraTypes];
};

export const formatNewsDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseDate(date));
