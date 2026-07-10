import type { PaperRecord } from "../../utils/papers";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

interface Props {
  paper: PaperRecord;
  locale: Locale;
  messages: IslandMessages["paper"];
}

export default function PaperCard({ paper, locale, messages }: Props) {
  const links = [
    paper.paperUrl ? { label: messages.paper, href: paper.paperUrl } : null,
    paper.codeUrl ? { label: messages.code, href: paper.codeUrl } : null,
    paper.projectUrl ? { label: messages.project, href: paper.projectUrl } : null
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <article className="paper-card">
      <div className="paper-card__main">
        <div className="paper-card__title-row">
          <h3>
            <a href={paper.href}>{paper.title}</a>
          </h3>
          {paper.review ? (
            <span className={`paper-score-badge paper-score-badge--${paper.review.scoreLevel}`}>
              <span>{messages.aiReview}</span>
              <strong>{paper.review.overallScore}</strong>
            </span>
          ) : (
            <span className="paper-badge paper-badge--needs-review">{messages.needsReview}</span>
          )}
          {paper.reviewDue ? <span className="paper-badge paper-badge--review-due">{messages.reviewDue}</span> : null}
          {paper.draft ? <span className="paper-badge paper-badge--draft">{messages.draft}</span> : null}
          {paper.featured ? <span className="paper-badge paper-badge--featured">{messages.featured}</span> : null}
        </div>
        <p className="paper-card__summary">{paper.oneLineSummary}</p>
        {paper.futureMeExcerpt ? <p className="metadata">{messages.futureMe}: {paper.futureMeExcerpt}</p> : null}
        <p className="metadata">
          {paper.authors.join(", ")} · {paper.venue} · {paper.year}
          {paper.readDate ? ` · ${messages.read} ${paper.readDate}` : ""}
        </p>
      </div>

      <div className="paper-card__badges" aria-label={messages.metadata} lang={locale}>
        <span className={`paper-badge paper-status-badge paper-status-badge--${paper.status}`}>
          {messages.statuses[paper.status]}
        </span>
        <span className={`paper-badge paper-depth-badge paper-depth-badge--${paper.depth}`}>
          {messages.depths[paper.depth]}
        </span>
        <span className="paper-badge paper-badge--muted">{messages.priority}: {messages.priorities[paper.priority]}</span>
        <span className="paper-badge paper-badge--muted">{messages.difficulty} {paper.difficulty}/5</span>
        <span className="paper-badge paper-badge--muted">{messages.minutes.replace("{count}", String(paper.readingTimeMinutes))}</span>
      </div>

      <div className="paper-card__tags" aria-label={messages.tags}>
        {paper.tags.map((tag) => (
          <span className="paper-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="paper-card__links">
        <a href={paper.href}>{messages.detail}</a>
        {links.map((link) => (
          <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}
