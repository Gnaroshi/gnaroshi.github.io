import AA from "../../../assets/dataset/application_ai.json";
import BA from "../../../assets/dataset/biomedical_ai.json";
import CA from "../../../assets/dataset/core_ai.json";
import MMA from "../../../assets/dataset/multi-modal_ai.json";
import HOME_MEDIA from "../../../assets/dataset/home_media.json";
import HOME_MEDIA_IMAGES from "../../../assets/images/home/home_media_index";
import RESEARCH from "../../../assets/dataset/performance_management.json";
import {
  countPeopleMembers,
  getPeopleEntriesBySection,
} from "../../../utils/peopleData";
import {
  formatNewsDate,
  getAllNewsItems,
  getLatestNewsItems,
  getNewsTypeMeta,
  isValidExternalUrl,
} from "../../../utils/newsData";

const DATASET_BY_CATEGORY = {
  application: AA.published,
  biomedical: BA.published,
  core: CA.published,
  "multi-modal": MMA.published,
};

const MEMBER_COUNT_GROUPS = ["professor", "intergrated_mp", "phd", "master", "intern", "alumni"];
const PREVIEW_GROUPS = ["intergrated_mp", "phd", "master", "intern"];

export const isValidHttpUrl = (url) => {
  return isValidExternalUrl(url);
};

export const aggregatePublications = () => {
  return Object.entries(DATASET_BY_CATEGORY)
    .flatMap(([category, dataset]) =>
      Object.entries(dataset).map(([key, value]) => ({
        key,
        category,
        ...value,
      })),
    )
    .sort((a, b) => {
      const dateA = new Date(a.research_meta.published_date);
      const dateB = new Date(b.research_meta.published_date);
      return dateB - dateA;
    });
};

export const getPublicationCategories = () => {
  return [
    "all",
    ...Object.entries(DATASET_BY_CATEGORY)
      .filter(([, dataset]) => Object.keys(dataset).length !== 0)
      .map(([category]) => category),
  ];
};

export const computeCounts = () => {
  const publications = aggregatePublications();
  const members = countPeopleMembers(MEMBER_COUNT_GROUPS);

  return {
    researchAreas: Object.keys(RESEARCH.contents).length,
    publications: publications.length,
    members,
    latestNews: getAllNewsItems().length,
  };
};

export const getLatestPublications = (limit = 3) => {
  return aggregatePublications().slice(0, limit);
};

export const getLatestNews = (limit = 5) => {
  return getLatestNewsItems(limit);
};

export { formatNewsDate, getAllNewsItems, getNewsTypeMeta };

const toRoleLine = (person, group) => {
  if (group === "professor") {
    return person.position || "Professor";
  }
  if (person.research_interests?.length) {
    return person.research_interests[0];
  }
  if (group === "alumni") {
    return person.current_position?.[0] || "Alumni";
  }
  return "Lab Member";
};

export const getPeoplePreview = (limit = 6) => {
  const professor = getPeopleEntriesBySection("professor").map((person) => ({
    id: `professor-${person.id}`,
    name: person.name,
    email: person.email,
    role: toRoleLine(person, "professor"),
    image: person.image,
  }));

  const members = PREVIEW_GROUPS
    .flatMap((group) =>
      getPeopleEntriesBySection(group).map((person) => ({
        id: `${group}-${person.id}`,
        name: person.name,
        email: person.email,
        role: toRoleLine(person, group),
        image: person.image,
      })),
    )
    .slice(0, Math.max(0, limit - professor.length));

  return [...professor, ...members];
};

export const getHomeMediaBySection = (sectionKey, limit = 1) =>
  Object.values(HOME_MEDIA.items ?? {})
    .filter((item) => item.section === sectionKey)
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    .slice(0, limit)
    .map((item) => ({
      ...item,
      image: HOME_MEDIA_IMAGES[item.image_key] ?? null,
    }));
