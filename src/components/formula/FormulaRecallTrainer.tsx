import { useMemo, useState } from "react";

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
};

const storageKey = "gnaroshi.formula-recall.v1";

export default function FormulaRecallTrainer({ papers, initialSlug, today }: Props) {
  const [activeSlug, setActiveSlug] = useState(initialSlug ?? papers[0]?.id ?? "");
  const [formulaText, setFormulaText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [confidence, setConfidence] = useState("medium");
  const [showAnswer, setShowAnswer] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const activePaper = papers.find((paper) => paper.id === activeSlug) ?? papers[0];

  const attemptJson = useMemo(() => {
    if (!activePaper) return "";
    return JSON.stringify(
      {
        schemaVersion: "1.0.0",
        paperSlug: activePaper.id,
        attemptedAt: new Date().toISOString(),
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
  }, [activePaper, confidence, formulaText, interpretation, showAnswer, today]);

  function saveLocalAttempt() {
    if (!activePaper) return;
    const existing = loadAttempts();
    window.localStorage.setItem(storageKey, JSON.stringify([...existing, JSON.parse(attemptJson)]));
    setSavedMessage("Saved locally in this browser. Copy the JSON if you want to commit it later.");
  }

  async function copyAttempt() {
    if (!attemptJson) return;
    await navigator.clipboard.writeText(attemptJson);
    setSavedMessage("Copied recall attempt JSON.");
  }

  async function copyManualScoringPrompt() {
    if (!activePaper) return;
    await navigator.clipboard.writeText(
      [
        "Evaluate this formula recall attempt. Return concise JSON only.",
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
    setSavedMessage("Copied manual scoring prompt.");
  }

  if (papers.length === 0) {
    return (
      <div className="paper-empty-state">
        <h3>No formulas ready for recall yet.</h3>
        <p>Add a main formula or recall prompt to a paper note, then revisit this trainer.</p>
      </div>
    );
  }

  return (
    <section className="learning-panel" aria-labelledby="formula-trainer-heading">
      <div className="paper-filter-panel__header">
        <div>
          <p className="eyebrow">Formula recall</p>
          <h2 id="formula-trainer-heading">Reconstruct before revealing</h2>
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

      {activePaper.formulaRecallPrompts.length > 0 ? (
        <div className="learning-card">
          <h3>Prompts</h3>
          <ul>
            {activePaper.formulaRecallPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="learning-card">
          <h3>Prompt</h3>
          <p>Write the main formula from memory and explain what each term does.</p>
        </div>
      )}

      <label className="learning-field">
        <span>Formula from memory</span>
        <textarea value={formulaText} onChange={(event) => setFormulaText(event.target.value)} rows={5} />
      </label>
      <label className="learning-field">
        <span>Plain-language interpretation</span>
        <textarea value={interpretation} onChange={(event) => setInterpretation(event.target.value)} rows={5} />
      </label>
      <label className="paper-field">
        <span>Confidence</span>
        <select value={confidence} onChange={(event) => setConfidence(event.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>

      <div className="paper-card__links">
        <button type="button" onClick={() => setShowAnswer((value) => !value)}>
          {showAnswer ? "Hide saved formula" : "Show saved formula"}
        </button>
        <button type="button" onClick={saveLocalAttempt}>
          Save locally
        </button>
        <button type="button" onClick={copyAttempt}>
          Copy attempt JSON
        </button>
        <button type="button" onClick={copyManualScoringPrompt}>
          Copy manual AI scoring prompt
        </button>
        <a href={activePaper.href}>Open paper note</a>
      </div>

      {showAnswer ? (
        <div className="learning-card learning-card--answer">
          <h3>Saved formula</h3>
          <pre><code>{activePaper.mainFormula || "No formula recorded."}</code></pre>
          <p>{activePaper.formulaInterpretation || "No interpretation recorded."}</p>
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
        <h3>Self-check</h3>
        <ul>
          <li>Did I write the formula before revealing it?</li>
          <li>Can I explain each term without rereading?</li>
          <li>Can I say when this formula is useful?</li>
          <li>Can I name one assumption or failure mode?</li>
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
