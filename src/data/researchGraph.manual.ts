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

export type ManualResearchGraphEdge = {
  sourceType: ResearchGraphNodeType;
  sourceSlug: string;
  targetType: ResearchGraphNodeType;
  targetSlug: string;
  type: ResearchGraphEdgeType;
  label?: string;
};

export const manualResearchGraphEdges: ManualResearchGraphEdge[] = [];
