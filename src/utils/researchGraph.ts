import graph from "../generated/research-graph.json";

export type ResearchGraphNodeType =
  | "paper"
  | "blog"
  | "project"
  | "implementation"
  | "question"
  | "topic"
  | "formula"
  | "weekly-review";

export type ResearchGraphEdgeType =
  | "cites"
  | "inspires"
  | "contradicts"
  | "extends"
  | "implements"
  | "explains"
  | "critiques"
  | "depends-on"
  | "revisits"
  | "belongs-to-topic"
  | "promoted-to-blog";

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
  nodes: ResearchGraphNode[];
  edges: ResearchGraphEdge[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    nodesByType: Record<string, number>;
    edgesByType: Record<string, number>;
  };
};

type StoredResearchGraph = Omit<ResearchGraph, "nodes"> & {
  nodes: Array<ResearchGraphNode & { source?: string }>;
};

const storedResearchGraph = graph as StoredResearchGraph;

export const researchGraph: ResearchGraph = {
  ...storedResearchGraph,
  nodes: storedResearchGraph.nodes.map(({ source: _source, ...node }) => node)
};

export function getGraphNode(type: string, slug: string): ResearchGraphNode | undefined {
  return researchGraph.nodes.find((node) => node.type === type && node.slug === slug);
}

export function getConnectedEdges(nodeId: string): ResearchGraphEdge[] {
  return researchGraph.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function getNodeById(nodeId: string): ResearchGraphNode | undefined {
  return researchGraph.nodes.find((node) => node.id === nodeId);
}
