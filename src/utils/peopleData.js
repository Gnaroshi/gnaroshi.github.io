import PEOPLE_DATA from "../assets/dataset/people.json";
import PEOPLE_IMAGES from "../assets/images/people/people_image_index";

const FALLBACK_TITLES = {
  professor: "Professor",
  intergrated_mp: "Intergrated M.S and Ph.D",
  phd: "Ph.D",
  master: "M.S",
  intern: "Intern",
  alumni: "Alumni",
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeStringList = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeText(item)).filter(Boolean);
};

const normalizeLinks = (links) => ({
  github: normalizeText(links?.github),
  linkedin: normalizeText(links?.linkedin),
  google_scholar: normalizeText(links?.google_scholar),
});

export const PEOPLE_SECTION_ORDER =
  PEOPLE_DATA.meta?.section_order ?? Object.keys(PEOPLE_DATA.sections ?? {});

export const getPeopleEntriesBySection = (sectionKey) => {
  const section = PEOPLE_DATA.sections?.[sectionKey];
  if (!section) {
    return [];
  }

  const sectionImages = PEOPLE_IMAGES[sectionKey] ?? {};

  return Object.entries(section.entries ?? {})
    .map(([id, person], index) => ({
      id,
      order: Number.isFinite(person?.order) ? person.order : index,
      name: normalizeText(person?.name),
      position: normalizeText(person?.position),
      email: normalizeText(person?.email),
      homepage: normalizeText(person?.homepage),
      research_interests: normalizeStringList(person?.research_interests),
      current_position: normalizeStringList(person?.current_position),
      links: normalizeLinks(person?.links),
      profile_details:
        person?.profile_details && typeof person.profile_details === "object"
          ? {
              biography: normalizeText(person.profile_details.biography),
              research_overview: normalizeText(person.profile_details.research_overview),
              education: normalizeText(person.profile_details.education),
              affiliations: normalizeText(person.profile_details.affiliations),
              responsibilities: normalizeText(person.profile_details.responsibilities),
              history: normalizeText(person.profile_details.history),
              achievements: normalizeText(person.profile_details.achievements),
            }
          : null,
      image: sectionImages[id] ?? null,
    }))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return a.name.localeCompare(b.name);
    })
    .map((person) => {
      const normalizedPerson = { ...person };
      delete normalizedPerson.order;
      return normalizedPerson;
    });
};

export const getPeopleSections = () =>
  PEOPLE_SECTION_ORDER.map((sectionKey) => {
    const section = PEOPLE_DATA.sections?.[sectionKey];

    return {
      key: sectionKey,
      title: section?.title || FALLBACK_TITLES[sectionKey] || sectionKey,
      people: getPeopleEntriesBySection(sectionKey),
    };
  });

export const countPeopleMembers = (sectionKeys = PEOPLE_SECTION_ORDER) =>
  sectionKeys.reduce((sum, sectionKey) => sum + getPeopleEntriesBySection(sectionKey).length, 0);
