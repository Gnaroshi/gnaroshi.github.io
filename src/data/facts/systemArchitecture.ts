export type RepositoryVisibility = "public" | "private";

export type RepositoryCategory =
  | "source"
  | "control"
  | "service"
  | "projection"
  | "presentation";

export type SystemRepository = {
  id:
    | "paper-lab"
    | "writing"
    | "studio"
    | "api"
    | "content-feed"
    | "website";
  repositoryName: string;
  visibility: RepositoryVisibility;
  category: RepositoryCategory;
  icon:
    | "paper"
    | "writing"
    | "studio"
    | "ai"
    | "feed"
    | "website";
  publicUrl?: string;
};

export type SystemConnection = {
  from: SystemRepository["id"];
  to: SystemRepository["id"];
  type: "source" | "publish" | "build" | "optional-service";
};

export const systemRepositories = [
  {
    id: "paper-lab",
    repositoryName: "gnaroshi-paper-lab",
    visibility: "private",
    category: "source",
    icon: "paper"
  },
  {
    id: "writing",
    repositoryName: "gnaroshi-writing",
    visibility: "private",
    category: "source",
    icon: "writing"
  },
  {
    id: "studio",
    repositoryName: "gnaroshi-studio",
    visibility: "private",
    category: "control",
    icon: "studio"
  },
  {
    id: "api",
    repositoryName: "gnaroshi-api",
    visibility: "private",
    category: "service",
    icon: "ai"
  },
  {
    id: "content-feed",
    repositoryName: "gnaroshi-content-feed",
    visibility: "public",
    category: "projection",
    icon: "feed",
    publicUrl: "https://github.com/Gnaroshi/gnaroshi-content-feed"
  },
  {
    id: "website",
    repositoryName: "gnaroshi.github.io",
    visibility: "public",
    category: "presentation",
    icon: "website",
    publicUrl: "https://github.com/Gnaroshi/gnaroshi.github.io"
  }
] as const satisfies readonly SystemRepository[];

export const systemConnections = [
  { from: "paper-lab", to: "studio", type: "source" },
  { from: "writing", to: "studio", type: "source" },
  { from: "studio", to: "content-feed", type: "publish" },
  { from: "content-feed", to: "website", type: "build" },
  { from: "studio", to: "api", type: "optional-service" }
] as const satisfies readonly SystemConnection[];

export function getSystemRepository(id: SystemRepository["id"]): SystemRepository {
  const repository = systemRepositories.find((item) => item.id === id);
  if (!repository) throw new Error(`Unknown system repository: ${id}`);
  return repository;
}

export function getSystemConnection(from: SystemRepository["id"], to: SystemRepository["id"]): SystemConnection {
  const connection = systemConnections.find((item) => item.from === from && item.to === to);
  if (!connection) throw new Error(`Unknown system connection: ${from} -> ${to}`);
  return connection;
}
