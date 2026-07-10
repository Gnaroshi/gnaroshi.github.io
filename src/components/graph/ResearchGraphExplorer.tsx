import { useMemo, useState } from "react";
import type { ResearchGraph, ResearchGraphEdge, ResearchGraphNode } from "../../utils/researchGraph";

interface Props {
  graph: ResearchGraph;
}

function labelForType(value: string) {
  return value.replaceAll("-", " ");
}

export default function ResearchGraphExplorer({ graph }: Props) {
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
    <div className="graph-explorer">
      <section className="graph-controls" aria-labelledby="graph-controls-heading">
        <div>
          <p className="eyebrow">Explorer</p>
          <h2 id="graph-controls-heading">Search the research graph</h2>
        </div>
        <div className="graph-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>Search</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="paper-field">
            <span>Node type</span>
            <select value={nodeType} onChange={(event) => setNodeType(event.target.value)}>
              <option value="">All node types</option>
              {nodeTypes.map((type) => (
                <option key={type} value={type}>
                  {labelForType(type)}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>Edge type</span>
            <select value={edgeType} onChange={(event) => setEdgeType(event.target.value)}>
              <option value="">All edge types</option>
              {edgeTypes.map((type) => (
                <option key={type} value={type}>
                  {labelForType(type)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="paper-filter-panel__reset" onClick={clearFilters}>
            Reset
          </button>
        </div>
      </section>

      <div className="graph-layout">
        <section className="graph-node-list" aria-labelledby="graph-nodes-heading">
          <div className="graph-section-header">
            <h2 id="graph-nodes-heading">Nodes</h2>
            <p>{filteredNodes.length} shown</p>
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
            <p className="empty-state">No nodes match these filters.</p>
          )}
        </section>

        <section className="graph-detail-panel" aria-labelledby="graph-detail-heading">
          <div className="graph-section-header">
            <h2 id="graph-detail-heading">Node detail</h2>
            {selectedNode && <a href={`/graph/${selectedNode.type}/${selectedNode.slug}/`}>Open detail</a>}
          </div>
          {selectedNode ? <NodeDetail node={selectedNode} edges={selectedEdges} nodeById={nodeById} /> : <p>No node selected.</p>}
        </section>
      </div>

      <section className="graph-edge-table" aria-labelledby="graph-edges-heading">
        <div className="graph-section-header">
          <h2 id="graph-edges-heading">Edges</h2>
          <p>{filteredEdges.length} relation{filteredEdges.length === 1 ? "" : "s"}</p>
        </div>
        {filteredEdges.length > 0 ? (
          <div className="graph-edge-list">
            {filteredEdges.slice(0, 120).map((edge) => (
              <EdgeRow edge={edge} nodeById={nodeById} key={edge.id} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No relations match these filters.</p>
        )}
      </section>
    </div>
  );
}

function NodeDetail({
  node,
  edges,
  nodeById
}: {
  node: ResearchGraphNode;
  edges: ResearchGraphEdge[];
  nodeById: Map<string, ResearchGraphNode>;
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
        <a href={node.href}>Open connected page</a>
      </div>
      <div>
        <h4>Connected relations</h4>
        {edges.length > 0 ? (
          <div className="graph-edge-list graph-edge-list--compact">
            {edges.slice(0, 12).map((edge) => (
              <EdgeRow edge={edge} nodeById={nodeById} key={edge.id} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No connected relations yet.</p>
        )}
      </div>
    </div>
  );
}

function EdgeRow({ edge, nodeById }: { edge: ResearchGraphEdge; nodeById: Map<string, ResearchGraphNode> }) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);

  return (
    <article className="graph-edge-row">
      <a href={source?.href ?? "#"}>{source?.label ?? edge.source}</a>
      <span>{labelForType(edge.type)}</span>
      <a href={target?.href ?? "#"}>{target?.label ?? edge.target}</a>
      <small>{edge.inferred ? "inferred" : "manual"}</small>
    </article>
  );
}
