import { useMemo, useState } from "react";
import type { ResearchGraph, ResearchGraphEdge, ResearchGraphNode } from "../../utils/researchGraph";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

interface Props {
  graph: ResearchGraph;
  locale: Locale;
  messages: IslandMessages["graph"];
}

function labelForType(value: string) {
  return value.replaceAll("-", " ");
}

export default function ResearchGraphExplorer({ graph, locale, messages }: Props) {
  const [query, setQuery] = useState("");
  const [nodeType, setNodeType] = useState("");
  const [edgeType, setEdgeType] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(graph.nodes[0]?.id ?? "");

  const nodeTypes = useMemo(() => [...new Set(graph.nodes.map((node) => node.type))].sort(), [graph.nodes]);
  const edgeTypes = useMemo(() => [...new Set(graph.edges.map((edge) => edge.type))].sort(), [graph.edges]);
  const nodeById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredNodes = useMemo(() => {
    return graph.nodes.filter((node) => {
      if (nodeType && node.type !== nodeType) return false;
      if (!normalizedQuery) return true;

      const haystack = [node.label, node.description, node.type, node.slug, node.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [graph.nodes, nodeType, normalizedQuery]);

  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map((node) => node.id)), [filteredNodes]);
  const filteredEdges = useMemo(() => {
    return graph.edges.filter((edge) => {
      if (edgeType && edge.type !== edgeType) return false;
      return visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target);
    });
  }, [graph.edges, edgeType, visibleNodeIds]);

  const selectedNode = filteredNodes.find((node) => node.id === selectedNodeId) ?? filteredNodes[0];
  const selectedEdges = selectedNode
    ? graph.edges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
    : [];

  function clearFilters() {
    setQuery("");
    setNodeType("");
    setEdgeType("");
  }

  return (
    <div className="graph-explorer" lang={locale}>
      <section className="graph-controls" aria-labelledby="graph-controls-heading">
        <div>
          <p className="eyebrow">{messages.explorer}</p>
          <h2 id="graph-controls-heading">{messages.title}</h2>
        </div>
        <div className="graph-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>{messages.search}</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="paper-field">
            <span>{messages.nodeType}</span>
            <select value={nodeType} onChange={(event) => setNodeType(event.target.value)}>
              <option value="">{messages.allNodeTypes}</option>
              {nodeTypes.map((type) => (
                <option key={type} value={type}>
                  {labelForType(type)}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>{messages.edgeType}</span>
            <select value={edgeType} onChange={(event) => setEdgeType(event.target.value)}>
              <option value="">{messages.allEdgeTypes}</option>
              {edgeTypes.map((type) => (
                <option key={type} value={type}>
                  {labelForType(type)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="paper-filter-panel__reset" onClick={clearFilters}>
            {messages.reset}
          </button>
        </div>
      </section>

      <div className="graph-layout">
        <section className="graph-node-list" aria-labelledby="graph-nodes-heading">
          <div className="graph-section-header">
            <h2 id="graph-nodes-heading">{messages.nodes}</h2>
            <p>{format(messages.shown, { count: filteredNodes.length })}</p>
          </div>
          {filteredNodes.length > 0 ? (
            <div className="graph-node-buttons">
              {filteredNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={node.id === selectedNode?.id ? "is-selected" : ""}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <span>{labelForType(node.type)}</span>
                  <strong>{node.label}</strong>
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-state">{messages.noNodes}</p>
          )}
        </section>

        <section className="graph-detail-panel" aria-labelledby="graph-detail-heading">
          <div className="graph-section-header">
            <h2 id="graph-detail-heading">{messages.detail}</h2>
            {selectedNode && <a href={`/graph/${selectedNode.type}/${selectedNode.slug}/`}>{messages.openDetail}</a>}
          </div>
          {selectedNode ? <NodeDetail node={selectedNode} edges={selectedEdges} nodeById={nodeById} messages={messages} /> : <p>{messages.noSelection}</p>}
        </section>
      </div>

      <section className="graph-edge-table" aria-labelledby="graph-edges-heading">
        <div className="graph-section-header">
          <h2 id="graph-edges-heading">{messages.edges}</h2>
          <p>{format(messages.relations, { count: filteredEdges.length })}</p>
        </div>
        {filteredEdges.length > 0 ? (
          <div className="graph-edge-list">
            {filteredEdges.slice(0, 120).map((edge) => (
              <EdgeRow edge={edge} nodeById={nodeById} messages={messages} key={edge.id} />
            ))}
          </div>
        ) : (
          <p className="empty-state">{messages.noRelations}</p>
        )}
      </section>
    </div>
  );
}

function NodeDetail({
  node,
  edges,
  nodeById,
  messages
}: {
  node: ResearchGraphNode;
  edges: ResearchGraphEdge[];
  nodeById: Map<string, ResearchGraphNode>;
  messages: IslandMessages["graph"];
}) {
  return (
    <div className="graph-node-detail">
      <p className="paper-badge paper-badge--muted">{labelForType(node.type)}</p>
      <h3>{node.label}</h3>
      {node.description ? <p>{node.description}</p> : null}
      <div className="badge-row">
        {node.tags.map((tag) => (
          <span className="paper-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="link-row">
        <a href={node.href}>{messages.openPage}</a>
      </div>
      <div>
        <h4>{messages.connected}</h4>
        {edges.length > 0 ? (
          <div className="graph-edge-list graph-edge-list--compact">
            {edges.slice(0, 12).map((edge) => (
              <EdgeRow edge={edge} nodeById={nodeById} messages={messages} key={edge.id} />
            ))}
          </div>
        ) : (
          <p className="empty-state">{messages.noConnected}</p>
        )}
      </div>
    </div>
  );
}

function EdgeRow({ edge, nodeById, messages }: { edge: ResearchGraphEdge; nodeById: Map<string, ResearchGraphNode>; messages: IslandMessages["graph"] }) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);

  return (
    <article className="graph-edge-row">
      <a href={source?.href ?? "#"}>{source?.label ?? edge.source}</a>
      <span>{labelForType(edge.type)}</span>
      <a href={target?.href ?? "#"}>{target?.label ?? edge.target}</a>
      <small>{edge.inferred ? messages.inferred : messages.manual}</small>
    </article>
  );
}

function format(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
}
