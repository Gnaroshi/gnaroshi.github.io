import { useMemo, useState } from "react";
import type { ReviewDueRecord } from "../../utils/reviewDue";

type Props = {
  papers: ReviewDueRecord[];
  today: string;
};

type LocalReview = {
  paperSlug: string;
  date: string;
  summaryRecall: string;
  formulaRecall: string;
  questionAnswer: string;
};

const storageKey = "gnaroshi.review-drafts.v1";

function loadLocalReviews(): LocalReview[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as LocalReview[];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: LocalReview[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(reviews));
}

function buildSnippet(review: LocalReview) {
  const note = [
    review.summaryRecall ? `Summary recall: ${review.summaryRecall}` : "",
    review.formulaRecall ? `Formula recall: ${review.formulaRecall}` : "",
    review.questionAnswer ? `Question answer: ${review.questionAnswer}` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `reviewHistory:
  - date: ${review.date}
    type: "manual"
    note: "${note.replaceAll('"', "'") || "Reviewed from memory."}"`;
}

export default function ReviewSession({ papers, today }: Props) {
  const [activeSlug, setActiveSlug] = useState(papers[0]?.id ?? "");
  const [summaryRecall, setSummaryRecall] = useState("");
  const [formulaRecall, setFormulaRecall] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [saved, setSaved] = useState<LocalReview[]>([]);
  const activePaper = papers.find((paper) => paper.id === activeSlug) ?? papers[0];

  const snippet = useMemo(() => {
    if (!activePaper) return "";
    return buildSnippet({
      paperSlug: activePaper.id,
      date: today,
      summaryRecall,
      formulaRecall,
      questionAnswer
    });
  }, [activePaper, formulaRecall, questionAnswer, summaryRecall, today]);

  function markReviewedLocally() {
    if (!activePaper) return;
    const nextReview = {
      paperSlug: activePaper.id,
      date: today,
      summaryRecall,
      formulaRecall,
      questionAnswer
    };
    const nextSaved = [...loadLocalReviews().filter((review) => review.paperSlug !== activePaper.id), nextReview];
    saveLocalReviews(nextSaved);
    setSaved(nextSaved);
  }

  async function copySnippet() {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
  }

  if (papers.length === 0) {
    return (
      <div className="paper-empty-state">
        <h2>No reviews due right now.</h2>
        <p>When a paper reaches its next spaced-review date, it will appear here.</p>
      </div>
    );
  }

  return (
    <section className="learning-panel" aria-labelledby="quick-review-heading">
      <div className="paper-filter-panel__header">
        <div>
          <p className="eyebrow">Quick review</p>
          <h2 id="quick-review-heading">Recall before looking</h2>
        </div>
      </div>

      <label className="paper-field">
        <span>Paper</span>
        <select value={activePaper.id} onChange={(event) => setActiveSlug(event.target.value)}>
          {papers.map((paper) => (
            <option value={paper.id} key={paper.id}>
              {paper.title}
            </option>
          ))}
        </select>
      </label>

      <div className="learning-card">
        <h3>{activePaper.title}</h3>
        <p>{activePaper.oneLineSummary}</p>
        <p className="metadata">
          Next review {activePaper.nextReviewDate} · {activePaper.isOverdue ? "overdue" : "due"}
        </p>
      </div>

      <label className="learning-field">
        <span>Rewrite one-line summary from memory</span>
        <textarea value={summaryRecall} onChange={(event) => setSummaryRecall(event.target.value)} rows={4} />
      </label>
      <label className="learning-field">
        <span>Rewrite main formula from memory</span>
        <textarea value={formulaRecall} onChange={(event) => setFormulaRecall(event.target.value)} rows={4} />
      </label>
      <label className="learning-field">
        <span>Answer retrieval question</span>
        <strong>{activePaper.retrievalQuestion}</strong>
        <textarea value={questionAnswer} onChange={(event) => setQuestionAnswer(event.target.value)} rows={4} />
      </label>

      <div className="paper-card__links">
        <button type="button" onClick={markReviewedLocally}>
          Mark reviewed locally
        </button>
        <button type="button" onClick={copySnippet}>
          Copy review update snippet
        </button>
        <a href={activePaper.href}>Open paper note</a>
      </div>

      <pre><code>{snippet}</code></pre>
      {saved.some((review) => review.paperSlug === activePaper.id) ? (
        <p className="metadata">Saved locally in this browser. Paste the snippet into the paper note to make it permanent.</p>
      ) : null}
    </section>
  );
}
