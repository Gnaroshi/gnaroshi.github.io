import { localizedData } from "./locales";

export const projects = localizedData.en.projects;
export type Project = (typeof projects)[number];
