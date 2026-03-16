import PUBLICATION_DATA from "../generated/publications.generated.json";

const parseDateSafe = (value) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return new Date("1970-01-01T00:00:00");
  }

  const parsed = new Date(`${text}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return new Date("1970-01-01T00:00:00");
  }
  return parsed;
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

export const getAllPublications = () =>
  (PUBLICATION_DATA?.items ?? [])
    .map((item, index) => {
      const id = normalizeText(item?.id) || `publication-${index + 1}`;
      const category = normalizeText(item?.category) || "core";
      const title = normalizeText(item?.title) || "Untitled publication";
      const researchMeta = item?.research_meta ?? {};
      const publishedDate = normalizeText(researchMeta?.published_date) || "1970-01-01";

      return {
        ...item,
        id,
        key: normalizeText(item?.key) || id,
        category,
        title,
        research_meta: {
          author: normalizeText(researchMeta?.author),
          published_place: normalizeText(researchMeta?.published_place),
          published_date: publishedDate,
          source_code_link: normalizeText(researchMeta?.source_code_link),
          paper_link: normalizeText(researchMeta?.paper_link),
        },
        _parsedDate: parseDateSafe(publishedDate),
      };
    })
    .sort((a, b) => b._parsedDate - a._parsedDate)
    .map((item) => {
      const normalizedItem = { ...item };
      delete normalizedItem._parsedDate;
      return normalizedItem;
    });

export const getPublicationCategories = () => {
  const categories = Array.from(new Set(getAllPublications().map((item) => item.category)));
  return ["all", ...categories];
};

export const getLatestPublications = (limit = 3) => getAllPublications().slice(0, limit);

