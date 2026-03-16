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
import {
  getAllPublications,
  getLatestPublications,
  getPublicationCategories,
} from "../../../utils/publicationData";

const MEMBER_COUNT_GROUPS = ["professor", "intergrated_mp", "phd", "master", "intern", "alumni"];
const PREVIEW_GROUPS = ["intergrated_mp", "phd", "master", "intern"];

export const isValidHttpUrl = (url) => {
  return isValidExternalUrl(url);
};

export const aggregatePublications = () => {
  return getAllPublications();
};

export { getPublicationCategories };

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

export { getLatestPublications };

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
