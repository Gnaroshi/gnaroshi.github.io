import { readContentFeedJson } from "./contentFeed";

export type ResearchGraphNodeType = "paper" | "post" | "project" | "implementation" | "question" | "topic" | "formula" | "weekly-review";
export type ResearchGraphEdgeType = "cites" | "inspires" | "contradicts" | "extends" | "implements" | "explains" | "critiques" | "depends-on" | "revisits" | "tagged" | "relates-to" | "writes-about" | "reviews";
export type ResearchGraphNode = { id: string; type: ResearchGraphNodeType; locale: "en" | "ko"; slug: string; label: string; description: string; href: string; tags: string[] };
export type ResearchGraphEdge = { id: string; source: string; target: string; type: ResearchGraphEdgeType; inferred: boolean };
export type ResearchGraph = {
  schemaVersion: string; generatedAt: string; eligible: boolean; eligibilityThreshold: number;
  nodes: ResearchGraphNode[]; edges: ResearchGraphEdge[];
  stats: { nodeCount: number; edgeCount: number; meaningfulNodeCount: number; nonTagEdgeCount: number; nodesByType: Record<string, number>; edgesByType: Record<string, number> };
};
type FeedGraph = {
  schemaVersion: number; generatedAt: string; eligible: boolean; eligibilityThreshold: number;
  nodes: Array<{ id: string; nodeType: ResearchGraphNodeType; locale: "en" | "ko"; label: string; href: string; description?: string; tags: string[] }>;
  edges: Array<{ id: string; sourceId: string; targetId: string; relation: ResearchGraphEdgeType; inferred: boolean }>;
};
function slugFromHref(href: string, id: string): string { return href.split("/").filter(Boolean).at(-1) ?? id; }
function countBy(values: string[]): Record<string, number> { return values.reduce<Record<string, number>>((counts, value) => ({ ...counts, [value]: (counts[value] ?? 0) + 1 }), {}); }
function loadResearchGraph(): ResearchGraph {
  const stored = readContentFeedJson<FeedGraph | null>("data/research-graph.json", null);
  if (!stored) return { schemaVersion: "1", generatedAt: "", eligible: false, eligibilityThreshold: 1, nodes: [], edges: [], stats: { nodeCount: 0, edgeCount: 0, meaningfulNodeCount: 0, nonTagEdgeCount: 0, nodesByType: {}, edgesByType: {} } };
  const nodes = stored.nodes.map((node) => ({ id: node.id, type: node.nodeType, locale: node.locale, slug: slugFromHref(node.href, node.id), label: node.label, description: node.description ?? "", href: node.href, tags: node.tags }));
  const edges = stored.edges.map((edge) => ({ id: edge.id, source: edge.sourceId, target: edge.targetId, type: edge.relation, inferred: edge.inferred }));
  return { schemaVersion: String(stored.schemaVersion), generatedAt: stored.generatedAt, eligible: stored.eligible, eligibilityThreshold: stored.eligibilityThreshold, nodes, edges, stats: { nodeCount: nodes.length, edgeCount: edges.length, meaningfulNodeCount: nodes.filter((node) => node.type !== "topic").length, nonTagEdgeCount: edges.filter((edge) => edge.type !== "tagged").length, nodesByType: countBy(nodes.map((node) => node.type)), edgesByType: countBy(edges.map((edge) => edge.type)) } };
}
export const researchGraph = loadResearchGraph();
export function getGraphNode(type: string, slug: string): ResearchGraphNode | undefined { return researchGraph.nodes.find((node) => node.type === type && node.slug === slug); }
export function getConnectedEdges(nodeId: string): ResearchGraphEdge[] { return researchGraph.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId); }
export function getNodeById(nodeId: string): ResearchGraphNode | undefined { return researchGraph.nodes.find((node) => node.id === nodeId); }
