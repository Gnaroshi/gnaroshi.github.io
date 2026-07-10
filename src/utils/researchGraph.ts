import { readContentFeedJson } from "./contentFeed";

export type ResearchGraphNodeType = "paper" | "blog" | "project" | "implementation" | "question" | "topic" | "formula" | "weekly-review";
export type ResearchGraphEdgeType = "cites" | "inspires" | "contradicts" | "extends" | "implements" | "explains" | "critiques" | "depends-on" | "revisits" | "belongs-to-topic" | "promoted-to-blog";

export type ResearchGraphNode = {
  id: string;
  type: ResearchGraphNodeType;
  slug: string;
  label: string;
  description: string;
  href: string;
  tags: string[];
};

export type ResearchGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: ResearchGraphEdgeType;
  label: string;
  inferred: boolean;
};

export type ResearchGraph = {
  schemaVersion: string;
  generatedAt: string;
  eligible?: boolean;
  nodes: ResearchGraphNode[];
  edges: ResearchGraphEdge[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    meaningfulNodeCount: number;
    nonTagEdgeCount: number;
    nodesByType: Record<string, number>;
    edgesByType: Record<string, number>;
  };
};

type FeedGraph = {
  schemaVersion?: number | string;
  updatedAt?: string;
  generatedAt?: string;
  eligible?: boolean;
  nodes?: Array<{ id: string; nodeType?: string; type?: string; label: string; href?: string; tags?: string[]; description?: string; slug?: string }>;
  edges?: Array<{ id: string; sourceId?: string; source?: string; targetId?: string; target?: string; relation?: string; type?: string; inferred?: boolean; label?: string }>;
};

function nodeType(value: string | undefined): ResearchGraphNodeType {
  if (value === "post") return "blog";
  if (["paper", "blog", "project", "implementation", "question", "topic", "formula", "weekly-review"].includes(value ?? "")) {
    return value as ResearchGraphNodeType;
  }
  return "topic";
}

function edgeType(value: string | undefined): ResearchGraphEdgeType {
  if (value === "tagged" || value === "relates-to") return "belongs-to-topic";
  if (value === "writes-about") return "promoted-to-blog";
  if (["cites", "inspires", "contradicts", "extends", "implements", "explains", "critiques", "depends-on", "revisits", "belongs-to-topic", "promoted-to-blog"].includes(value ?? "")) {
    return value as ResearchGraphEdgeType;
  }
  return "depends-on";
}

function slugFrom(node: NonNullable<FeedGraph["nodes"]>[number]): string {
  if (node.slug) return node.slug;
  const href = node.href?.split("/").filter(Boolean).at(-1);
  return href || node.id.split(":").at(-1) || node.id;
}

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => ({ ...counts, [value]: (counts[value] ?? 0) + 1 }), {});
}

function loadResearchGraph(): ResearchGraph {
  const stored = readContentFeedJson<FeedGraph>("data/research-graph.json", {});
  const nodes = (stored.nodes ?? []).map((node) => ({
    id: node.id,
    type: nodeType(node.nodeType ?? node.type),
    slug: slugFrom(node),
    label: node.label,
    description: node.description ?? "",
    href: node.href ?? "/graph/",
    tags: node.tags ?? []
  }));
  const edges = (stored.edges ?? []).map((edge) => ({
    id: edge.id,
    source: edge.sourceId ?? edge.source ?? "",
    target: edge.targetId ?? edge.target ?? "",
    type: edgeType(edge.relation ?? edge.type),
    label: edge.label ?? edge.relation ?? edge.type ?? "related",
    inferred: edge.inferred ?? false
  })).filter((edge) => edge.source && edge.target);
  const nonTagEdgeCount = edges.filter((edge) => edge.type !== "belongs-to-topic").length;
  return {
    schemaVersion: String(stored.schemaVersion ?? 1),
    generatedAt: stored.updatedAt ?? stored.generatedAt ?? "",
    eligible: stored.eligible,
    nodes,
    edges,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      meaningfulNodeCount: nodes.filter((node) => node.type !== "topic").length,
      nonTagEdgeCount,
      nodesByType: countBy(nodes.map((node) => node.type)),
      edgesByType: countBy(edges.map((edge) => edge.type))
    }
  };
}

export const researchGraph = loadResearchGraph();

export function getGraphNode(type: string, slug: string): ResearchGraphNode | undefined {
  return researchGraph.nodes.find((node) => node.type === type && node.slug === slug);
}

export function getConnectedEdges(nodeId: string): ResearchGraphEdge[] {
  return researchGraph.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function getNodeById(nodeId: string): ResearchGraphNode | undefined {
  return researchGraph.nodes.find((node) => node.id === nodeId);
}
