#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const outputPath = join(root, "src", "generated", "research-graph.json");
const manualEdgesPath = join(root, "src", "data", "researchGraph.manual.ts");
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const graph = buildResearchGraph();
  writeGeneratedGraph(graph, args.force);
  console.log(`Research graph: ${graph.nodes.length} node(s), ${graph.edges.length} edge(s).`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = { force: false, help: false };

  for (const value of values) {
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--force") parsed.force = true;
    else fail(`Unknown argument: ${value}`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Build the static research graph JSON.

Usage:
  npm run graph:build
  npm run graph:build -- --force

Options:
  --force      Overwrite src/generated/research-graph.json when graph content changed.
  --help, -h   Show this help message.

The script reads public blog posts, paper logs, content projects, implementation attempts,
weekly reviews, project card data, and src/data/researchGraph.manual.ts.`);
}

function buildResearchGraph() {
  const nodes = new Map();
  const edges = new Map();
  const papers = loadContentItems("papers");
  const blogPosts = loadContentItems("blog");
  const contentProjects = loadContentItems("projects");
  const implementationAttempts = loadContentItems("implementations");
  const weeklyReviews = loadWeeklyReviews();
  const dataProjects = loadProjectDataCards();

  for (const paper of papers) {
    addNode(nodes, {
      type: "paper",
      slug: paper.slug,
      label: paper.data.title,
      description: paper.data.oneLineSummary || paper.data.coreQuestion || "",
      href: `/papers/${paper.slug}/`,
      tags: normalizeTags([...(paper.data.tags ?? []), ...(paper.data.relatedTopics ?? [])]),
      source: paper.relativePath
    });
    addTopicEdges(nodes, edges, "paper", paper.slug, [...(paper.data.tags ?? []), ...(paper.data.relatedTopics ?? [])]);
    addQuestionNode(nodes, edges, paper);
    addFormulaNode(nodes, edges, paper);
  }

  for (const post of blogPosts) {
    addNode(nodes, {
      type: "blog",
      slug: post.slug,
      label: post.data.title,
      description: post.data.description ?? "",
      href: `/blog/${post.slug}/`,
      tags: normalizeTags(post.data.tags ?? []),
      source: post.relativePath
    });
    addTopicEdges(nodes, edges, "blog", post.slug, post.data.tags ?? []);
  }

  for (const project of [...dataProjects, ...contentProjects]) {
    addNode(nodes, {
      type: "project",
      slug: project.slug,
      label: project.data.title,
      description: project.data.summary || project.data.description || "",
      href: "/projects/",
      tags: normalizeTags(project.data.tags ?? []),
      source: project.relativePath
    });
    addTopicEdges(nodes, edges, "project", project.slug, project.data.tags ?? []);
  }

  for (const attempt of implementationAttempts) {
    addNode(nodes, {
      type: "implementation",
      slug: attempt.slug,
      label: attempt.data.title,
      description: attempt.data.goal ?? "",
      href: `/implementations/${attempt.slug}/`,
      tags: normalizeTags(attempt.data.tags ?? []),
      source: attempt.relativePath
    });
    addTopicEdges(nodes, edges, "implementation", attempt.slug, attempt.data.tags ?? []);
  }

  for (const review of weeklyReviews) {
    addNode(nodes, {
      type: "weekly-review",
      slug: review.weekId,
      label: review.weekId,
      description: review.summary,
      href: `/week/${review.weekId}/`,
      tags: ["weekly-review"],
      source: review.relativePath
    });
    addTopicEdges(nodes, edges, "weekly-review", review.weekId, ["weekly-review"]);
  }

  inferBlogPaperEdges(edges, blogPosts, papers);
  inferProjectPaperEdges(edges, [...dataProjects, ...contentProjects], papers);
  inferImplementationEdges(edges, implementationAttempts, papers, [...dataProjects, ...contentProjects]);
  addManualEdges(nodes, edges);

  collapseLowValueTopics(nodes, edges);
  const nodeList = [...nodes.values()].sort((a, b) => a.type.localeCompare(b.type) || a.label.localeCompare(b.label));
  const edgeList = [...edges.values()].filter((edge) => nodes.has(edge.source) && nodes.has(edge.target));
  const meaningfulNodeCount = nodeList.filter((node) => node.type !== "topic").length;
  const nonTagEdgeCount = edgeList.filter(
    (edge) => !edge.source.startsWith("topic:") && !edge.target.startsWith("topic:")
  ).length;
  const eligible = meaningfulNodeCount >= 5 && nonTagEdgeCount >= 3;

  return {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    eligible,
    nodes: nodeList,
    edges: edgeList.sort((a, b) => a.type.localeCompare(b.type) || a.source.localeCompare(b.source) || a.target.localeCompare(b.target)),
    stats: {
      nodeCount: nodeList.length,
      edgeCount: edgeList.length,
      meaningfulNodeCount,
      nonTagEdgeCount,
      nodesByType: countBy(nodeList, "type"),
      edgesByType: countBy(edgeList, "type")
    }
  };
}

function loadContentItems(collection) {
  const directory = join(root, "src", "content", collection);
  if (!existsSync(directory)) return [];

  return listMarkdownFiles(directory)
    .filter((filePath) => !basename(filePath).startsWith("_"))
    .map((filePath) => {
      const raw = readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      return {
        slug: basename(filePath, extname(filePath)),
        filePath,
        relativePath: relative(root, filePath),
        data: parsed.data,
        body: parsed.content.trim()
      };
    })
    .filter((item) => isPublicContent(item.data) && item.data.graphEligible !== false && item.data.contentStage !== "seed");
}

function loadWeeklyReviews() {
  const directory = join(root, "src", "generated", "weekly-reviews");
  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = join(directory, fileName);
      const review = JSON.parse(readFileSync(filePath, "utf8"));
      return {
        ...review,
        relativePath: relative(root, filePath)
      };
    })
    .filter(
      (review) =>
        (review.visibility ?? "public") === "public" &&
        review.graphEligible !== false &&
        review.contentStage !== "seed"
    );
}

function loadProjectDataCards() {
  const filePath = join(root, "src", "data", "projects.ts");
  if (!existsSync(filePath)) return [];

  const raw = readFileSync(filePath, "utf8");
  const cards = [];
  const blockPattern = /\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?summary:\s*"([^"]+)",[\s\S]*?status:\s*"([^"]+)",[\s\S]*?graphEligible:\s*(true|false),[\s\S]*?tags:\s*\[([^\]]*)\]/g;
  let match;

  while ((match = blockPattern.exec(raw))) {
    if (match[5] !== "true") continue;
    cards.push({
      slug: match[1],
      relativePath: "src/data/projects.ts",
      data: {
        title: match[2],
        summary: match[3],
        status: match[4],
        graphEligible: true,
        tags: [...match[6].matchAll(/"([^"]+)"/g)].map((tagMatch) => tagMatch[1])
      },
      body: ""
    });
  }

  return cards;
}

function listMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...listMarkdownFiles(fullPath));
    else if (entry.endsWith(".md") || entry.endsWith(".mdx")) files.push(fullPath);
  }

  return files;
}

function addNode(nodes, node) {
  const id = `${node.type}:${node.slug}`;
  if (nodes.has(id)) return;
  nodes.set(id, {
    id,
    type: node.type,
    slug: node.slug,
    label: node.label,
    description: node.description ?? "",
    href: node.href,
    tags: node.tags ?? [],
    source: node.source
  });
}

function addEdge(edges, edge) {
  const id = `${edge.source}->${edge.type}->${edge.target}`;
  if (edges.has(id)) return;
  edges.set(id, {
    id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    label: edge.label ?? "",
    inferred: edge.inferred ?? true
  });
}

function addTopicEdges(nodes, edges, type, slug, tags) {
  for (const tag of normalizeTags(tags)) {
    const topicSlug = slugify(tag);
    addNode(nodes, {
      type: "topic",
      slug: topicSlug,
      label: tag,
      description: `Research items tagged ${tag}.`,
      href: `/graph/topic/${topicSlug}/`,
      tags: [tag],
      source: "inferred"
    });
    addEdge(edges, {
      source: `${type}:${slug}`,
      target: `topic:${topicSlug}`,
      type: "belongs-to-topic",
      label: tag,
      inferred: true
    });
  }
}

function collapseLowValueTopics(nodes, edges) {
  const degree = new Map();
  for (const edge of edges.values()) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  }
  const collapsed = new Set(
    [...nodes.values()]
      .filter((node) => node.type === "topic" && (degree.get(node.id) ?? 0) <= 1)
      .map((node) => node.id)
  );
  for (const id of collapsed) nodes.delete(id);
  for (const [id, edge] of edges) {
    if (collapsed.has(edge.source) || collapsed.has(edge.target)) edges.delete(id);
  }
}

function addQuestionNode(nodes, edges, paper) {
  const question = String(paper.data.coreQuestion ?? "").trim();
  if (!question) return;
  const slug = `${paper.slug}-core-question`;
  addNode(nodes, {
    type: "question",
    slug,
    label: question,
    description: `Question extracted from ${paper.data.title}.`,
    href: `/graph/question/${slug}/`,
    tags: normalizeTags(paper.data.tags ?? []),
    source: paper.relativePath
  });
  addEdge(edges, {
    source: `paper:${paper.slug}`,
    target: `question:${slug}`,
    type: "explains",
    label: "core question",
    inferred: true
  });
}

function addFormulaNode(nodes, edges, paper) {
  const formula = String(paper.data.mainFormula ?? "").trim();
  if (!formula) return;
  const slug = `${paper.slug}-main-formula`;
  addNode(nodes, {
    type: "formula",
    slug,
    label: formula,
    description: paper.data.formulaInterpretation ?? "",
    href: `/graph/formula/${slug}/`,
    tags: normalizeTags(paper.data.tags ?? []),
    source: paper.relativePath
  });
  addEdge(edges, {
    source: `paper:${paper.slug}`,
    target: `formula:${slug}`,
    type: "explains",
    label: "main formula",
    inferred: true
  });
}

function inferBlogPaperEdges(edges, blogPosts, papers) {
  for (const post of blogPosts) {
    for (const paper of papers) {
      const referencesPaper =
        post.data.sourcePaper === paper.slug ||
        post.body.includes(`/papers/${paper.slug}`) ||
        post.body.includes(`papers/${paper.slug}`) ||
        post.body.includes(paper.slug);

      if (!referencesPaper) continue;
      addEdge(edges, {
        source: `blog:${post.slug}`,
        target: `paper:${paper.slug}`,
        type: "explains",
        label: "references paper note",
        inferred: true
      });

      if (post.data.sourcePaper === paper.slug) {
        addEdge(edges, {
          source: `paper:${paper.slug}`,
          target: `blog:${post.slug}`,
          type: "promoted-to-blog",
          label: "promoted paper note",
          inferred: true
        });
      }
    }
  }
}

function inferProjectPaperEdges(edges, projects, papers) {
  for (const project of projects) {
    for (const paper of papers) {
      if (!project.data.paperUrl || !paper.data.paperUrl || project.data.paperUrl !== paper.data.paperUrl) continue;
      addEdge(edges, {
        source: `project:${project.slug}`,
        target: `paper:${paper.slug}`,
        type: "depends-on",
        label: "linked paper",
        inferred: true
      });
    }
  }
}

function inferImplementationEdges(edges, attempts, papers, projects) {
  const paperSlugs = new Set(papers.map((paper) => paper.slug));
  const projectSlugs = new Set(projects.map((project) => project.slug));

  for (const attempt of attempts) {
    for (const paperSlug of attempt.data.relatedPapers ?? []) {
      if (!paperSlugs.has(paperSlug)) continue;
      addEdge(edges, {
        source: `implementation:${attempt.slug}`,
        target: `paper:${paperSlug}`,
        type: "implements",
        label: "implementation attempt",
        inferred: true
      });
    }

    for (const projectSlug of attempt.data.relatedProjects ?? []) {
      if (!projectSlugs.has(projectSlug)) continue;
      addEdge(edges, {
        source: `implementation:${attempt.slug}`,
        target: `project:${projectSlug}`,
        type: "implements",
        label: "project implementation",
        inferred: true
      });
    }
  }
}

function addManualEdges(nodes, edges) {
  for (const manualEdge of loadManualEdges()) {
    const source = `${manualEdge.sourceType}:${manualEdge.sourceSlug}`;
    const target = `${manualEdge.targetType}:${manualEdge.targetSlug}`;
    if (!nodes.has(source) || !nodes.has(target)) continue;
    addEdge(edges, {
      source,
      target,
      type: manualEdge.type,
      label: manualEdge.label ?? "manual edge",
      inferred: false
    });
  }
}

function loadManualEdges() {
  if (!existsSync(manualEdgesPath)) return [];

  const raw = readFileSync(manualEdgesPath, "utf8");
  const start = raw.indexOf("manualResearchGraphEdges");
  if (start === -1) return [];

  const arrayStart = raw.indexOf("[", start);
  if (arrayStart === -1) return [];

  let depth = 0;
  for (let index = arrayStart; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) {
      const literal = raw.slice(arrayStart, index + 1);
      return Function(`"use strict"; return (${literal});`)();
    }
  }

  return [];
}

function isPublicContent(data) {
  return data.draft !== true && (data.visibility ?? "public") === "public";
}

function normalizeTags(tags) {
  return [...new Set((tags ?? []).map((tag) => String(tag).trim()).filter(Boolean))];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] ?? 0) + 1;
    return counts;
  }, {});
}

function writeGeneratedGraph(graph, force) {
  mkdirSync(join(root, "src", "generated"), { recursive: true });

  if (!existsSync(outputPath)) {
    writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
    console.log(`Created ${relative(root, outputPath)}`);
    return;
  }

  const current = JSON.parse(readFileSync(outputPath, "utf8"));
  const currentComparable = JSON.stringify({ ...current, generatedAt: "" });
  const nextComparable = JSON.stringify({ ...graph, generatedAt: "" });

  if (currentComparable === nextComparable) {
    console.log(`${relative(root, outputPath)} is already up to date.`);
    return;
  }

  if (!force) {
    throw new Error(`${relative(root, outputPath)} already exists and graph content changed. Re-run with --force to overwrite.`);
  }

  writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`);
  console.log(`Updated ${relative(root, outputPath)}`);
}

function fail(message) {
  console.error(`graph:build: ${message}`);
  console.error("Run npm run graph:build -- --help for usage.");
  process.exit(1);
}
