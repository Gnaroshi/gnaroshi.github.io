import type { PaperRecord } from "../../utils/papers";

interface Props {
  paper: PaperRecord;
}

const statusLabels: Record<PaperRecord["status"], string> = {
  planned: "Planned",
  pass1: "Pass 1",
  pass2: "Pass 2",
  pass3: "Pass 3",
  read: "Read",
  implemented: "Implemented",
  abandoned: "Abandoned"
};

const depthLabels: Record<PaperRecord["depth"], string> = {
  skim: "Skim",
  understand: "Understand",
  deep: "Deep",
  reproduce: "Reproduce",
  implement: "Implement"
};

export default function PaperCard({ paper }: Props) {
  const links = [
    paper.paperUrl ? { label: "Paper", href: paper.paperUrl } : null,
    paper.codeUrl ? { label: "Code", href: paper.codeUrl } : null,
    paper.projectUrl ? { label: "Project", href: paper.projectUrl } : null
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <article className="paper-card">
      <div className="paper-card__main">
        <div className="paper-card__title-row">
          <h3>
            <a href={paper.href}>{paper.title}</a>
          </h3>
          {paper.draft ? <span className="paper-badge paper-badge--draft">Draft</span> : null}
          {paper.featured ? <span className="paper-badge paper-badge--featured">Featured</span> : null}
        </div>
        <p className="paper-card__summary">{paper.oneLineSummary}</p>
        <p className="metadata">
          {paper.authors.join(", ")} · {paper.venue} · {paper.year}
          {paper.readDate ? ` · read ${paper.readDate}` : ""}
        </p>
      </div>

      <div className="paper-card__badges" aria-label="Paper metadata">
        <span className={`paper-badge paper-status-badge paper-status-badge--${paper.status}`}>
          {statusLabels[paper.status]}
        </span>
        <span className={`paper-badge paper-depth-badge paper-depth-badge--${paper.depth}`}>
          {depthLabels[paper.depth]}
        </span>
        <span className="paper-badge paper-badge--muted">Priority: {paper.priority}</span>
        <span className="paper-badge paper-badge--muted">Difficulty {paper.difficulty}/5</span>
        <span className="paper-badge paper-badge--muted">{paper.readingTimeMinutes} min</span>
      </div>

      <div className="paper-card__tags" aria-label="Paper tags">
        {paper.tags.map((tag) => (
          <span className="paper-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="paper-card__links">
        <a href={paper.href}>Detail page</a>
        {links.map((link) => (
          <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

