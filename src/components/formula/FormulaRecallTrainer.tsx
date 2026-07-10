import { useEffect, useMemo, useState } from "react";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

export type FormulaRecallPaper = {
  id: string;
  title: string;
  href: string;
  mainFormula: string;
  formulaInterpretation: string;
  formulaTerms: Array<{ symbol: string; meaning: string }>;
  formulaRecallPrompts: string[];
  tags: string[];
};

type Props = {
  papers: FormulaRecallPaper[];
  initialSlug?: string;
  today: string;
  locale: Locale;
  messages: IslandMessages["formula"];
};

const storageKey = "gnaroshi.formula-recall.v1";

export default function FormulaRecallTrainer({ papers, initialSlug, today, locale, messages }: Props) {
  const [activeSlug, setActiveSlug] = useState(initialSlug ?? papers[0]?.id ?? "");
  const [formulaText, setFormulaText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [confidence, setConfidence] = useState("medium");
  const [showAnswer, setShowAnswer] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [attemptedAt, setAttemptedAt] = useState("");
  const activePaper = papers.find((paper) => paper.id === activeSlug) ?? papers[0];

  useEffect(() => setAttemptedAt(new Date().toISOString()), []);

  const attemptJson = useMemo(() => {
    if (!activePaper) return "";
    return JSON.stringify(
      {
        schemaVersion: "1.0.0",
        paperSlug: activePaper.id,
        attemptedAt,
        localDate: today,
        formulaText,
        interpretation,
        confidence,
        selfCheck: {
          wroteFormulaBeforeReveal: Boolean(formulaText.trim()),
          wroteInterpretationBeforeReveal: Boolean(interpretation.trim()),
          revealedAnswer: showAnswer
        }
      },
      null,
      2
    );
  }, [activePaper, attemptedAt, confidence, formulaText, interpretation, showAnswer, today]);

  function saveLocalAttempt() {
    if (!activePaper) return;
    const existing = loadAttempts();
    window.localStorage.setItem(storageKey, JSON.stringify([...existing, JSON.parse(attemptJson)]));
    setSavedMessage(messages.saved);
  }

  async function copyAttempt() {
    if (!attemptJson) return;
    await navigator.clipboard.writeText(attemptJson);
    setSavedMessage(messages.copied);
  }

  async function copyManualScoringPrompt() {
    if (!activePaper) return;
    await navigator.clipboard.writeText(
      [
        locale === "ko" ? "이 수식 회상 시도를 평가하고 간결한 JSON만 반환하세요." : "Evaluate this formula recall attempt. Return concise JSON only.",
        "",
        `Paper: ${activePaper.title}`,
        `Saved formula: ${activePaper.mainFormula || "No formula recorded."}`,
        `Saved interpretation: ${activePaper.formulaInterpretation || "No interpretation recorded."}`,
        "",
        "Attempt JSON:",
        attemptJson,
        "",
        "Score evidence of recall, term understanding, interpretation, and uncertainty. Do not overclaim correctness."
      ].join("\n")
    );
    setSavedMessage(messages.promptCopied);
  }

  if (papers.length === 0) {
    return (
      <div className="paper-empty-state" lang={locale}>
        <h2>{messages.noMaterial}</h2>
        <p>{messages.noMaterialBody}</p>
      </div>
    );
  }

  return (
    <section className="learning-panel" aria-labelledby="formula-trainer-heading" lang={locale}>
      <div className="paper-filter-panel__header">
        <div>
          <p className="eyebrow">{messages.title}</p>
          <h2 id="formula-trainer-heading">{messages.heading}</h2>
        </div>
      </div>

      <label className="paper-field">
        <span>{messages.select}</span>
        <select value={activePaper.id} onChange={(event) => setActiveSlug(event.target.value)}>
          {papers.map((paper) => (
            <option value={paper.id} key={paper.id}>
              {paper.title}
            </option>
          ))}
        </select>
      </label>

      {activePaper.formulaRecallPrompts.length > 0 ? (
        <div className="learning-card">
          <h3>{messages.prompts}</h3>
          <ul>
            {activePaper.formulaRecallPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="learning-card">
          <h3>{messages.prompt}</h3>
          <p>{messages.defaultPrompt}</p>
        </div>
      )}

      <label className="learning-field">
        <span>{messages.answer}</span>
        <textarea value={formulaText} onChange={(event) => setFormulaText(event.target.value)} rows={5} />
      </label>
      <label className="learning-field">
        <span>{messages.interpretation}</span>
        <textarea value={interpretation} onChange={(event) => setInterpretation(event.target.value)} rows={5} />
      </label>
      <label className="paper-field">
        <span>{messages.confidence}</span>
        <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
          <option value="low">{messages.low}</option>
          <option value="medium">{messages.medium}</option>
          <option value="high">{messages.high}</option>
        </select>
      </label>

      <div className="paper-card__links">
        <button type="button" onClick={() => setShowAnswer((value) => !value)}>
          {showAnswer ? messages.hide : messages.reveal}
        </button>
        <button type="button" onClick={saveLocalAttempt}>
          {messages.save}
        </button>
        <button type="button" onClick={copyAttempt}>
          {messages.copy}
        </button>
        <button type="button" onClick={copyManualScoringPrompt}>
          {messages.copyPrompt}
        </button>
        <a href={activePaper.href}>{messages.openPaper}</a>
      </div>

      {showAnswer ? (
        <div className="learning-card learning-card--answer">
          <h3>{messages.savedFormula}</h3>
          <pre><code>{activePaper.mainFormula || messages.noFormula}</code></pre>
          <p>{activePaper.formulaInterpretation || messages.noInterpretation}</p>
          {activePaper.formulaTerms.length > 0 ? (
            <dl className="formula-term-list">
              {activePaper.formulaTerms.map((term) => (
                <div key={term.symbol}>
                  <dt>{term.symbol}</dt>
                  <dd>{term.meaning}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      <div className="learning-card">
        <h3>{messages.selfCheck}</h3>
        <ul>
          {messages.checks.map((check) => <li key={check}>{check}</li>)}
        </ul>
      </div>

      <pre><code>{attemptJson}</code></pre>
      {savedMessage ? <p className="metadata">{savedMessage}</p> : null}
    </section>
  );
}

function loadAttempts(): unknown[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown[];
  } catch {
    return [];
  }
}
