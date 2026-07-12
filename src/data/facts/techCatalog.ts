import type { PlatformId, TechId } from "./projects";

export type TechItem = {
  id: TechId;
  label: string;
  category: "language" | "ui" | "runtime" | "framework" | "data" | "integration" | "distribution";
  iconId: "code" | "window" | "terminal" | "layers" | "database" | "link" | "package";
  source: "package-json" | "cargo-toml" | "pyproject" | "xcode-project" | "repository-doc";
};

export const techCatalog: Readonly<Record<TechId, TechItem>> = {
  python:{id:"python",label:"Python",category:"language",iconId:"code",source:"pyproject"}, shell:{id:"shell",label:"Shell",category:"language",iconId:"terminal",source:"repository-doc"}, yaml:{id:"yaml",label:"YAML",category:"data",iconId:"database",source:"repository-doc"},
  astro:{id:"astro",label:"Astro",category:"framework",iconId:"layers",source:"package-json"}, typescript:{id:"typescript",label:"TypeScript",category:"language",iconId:"code",source:"package-json"}, "github-actions":{id:"github-actions",label:"GitHub Actions",category:"distribution",iconId:"package",source:"repository-doc"}, playwright:{id:"playwright",label:"Playwright",category:"framework",iconId:"window",source:"package-json"},
  react:{id:"react",label:"React",category:"ui",iconId:"window",source:"package-json"}, rust:{id:"rust",label:"Rust",category:"language",iconId:"code",source:"cargo-toml"}, tauri:{id:"tauri",label:"Tauri",category:"runtime",iconId:"package",source:"cargo-toml"}, swift:{id:"swift",label:"Swift",category:"language",iconId:"code",source:"xcode-project"}, swiftui:{id:"swiftui",label:"SwiftUI",category:"ui",iconId:"window",source:"xcode-project"},
  "zotero-local-api":{id:"zotero-local-api",label:"Zotero Local API",category:"integration",iconId:"link",source:"repository-doc"}, flask:{id:"flask",label:"Flask",category:"framework",iconId:"layers",source:"repository-doc"}, jinja:{id:"jinja",label:"Jinja",category:"ui",iconId:"window",source:"repository-doc"}, sqlite:{id:"sqlite",label:"SQLite",category:"data",iconId:"database",source:"xcode-project"}, electron:{id:"electron",label:"Electron",category:"runtime",iconId:"package",source:"package-json"}, vite:{id:"vite",label:"Vite",category:"framework",iconId:"layers",source:"package-json"}, fastify:{id:"fastify",label:"Fastify",category:"framework",iconId:"layers",source:"package-json"}
};

export const platformLabels: Readonly<Record<PlatformId, { en: string; ko: string }>> = {
  web:{en:"Web",ko:"웹"}, macos:{en:"macOS",ko:"macOS"}, cli:{en:"CLI",ko:"CLI"}, "static-site":{en:"Static site",ko:"정적 사이트"}
};

export const techIconAttribution = {
  name: "Gnaroshi interface symbols",
  license: "Original repository-owned SVG paths",
  note: "Generic category symbols identify technology groups; visible text carries the technology name."
} as const;
