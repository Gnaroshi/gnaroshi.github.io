import { useMemo, useState } from "react";
import type { QuestionBankItem } from "../../utils/questionBank";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

type Props = {
  questions: QuestionBankItem[];
  today: string;
  locale: Locale;
  messages: IslandMessages["question"];
};

const storageKey = "gnaroshi.question-practice.v1";

type LocalQuestionState = {
  id: string;
  lastAsked: string;
  timesAsked: number;
  lastScore: number | null;
  lastAnswer: string;
};

export default function QuestionPractice({ questions, today, locale, messages }: Props) {
  const [activeType, setActiveType] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?.id ?? "");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState("3");
  const [message, setMessage] = useState("");
  const filteredQuestions = useMemo(
    () => questions.filter((question) => !activeType || question.type === activeType),
    [activeType, questions]
  );
  const activeQuestion =
    filteredQuestions.find((question) => question.id === activeQuestionId) ?? filteredQuestions[0] ?? questions[0];
  const types = [...new Set(questions.map((question) => question.type))].sort();

  function pickRandom() {
    if (filteredQuestions.length === 0) return;
    const next = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
    setActiveQuestionId(next.id);
    setAnswer("");
    setMessage("");
  }

  function saveLocalPractice() {
    if (!activeQuestion) return;
    const existing = loadLocalState();
    const previous = existing.find((item) => item.id === activeQuestion.id);
    const nextItem: LocalQuestionState = {
      id: activeQuestion.id,
      lastAsked: today,
      timesAsked: (previous?.timesAsked ?? activeQuestion.timesAsked ?? 0) + 1,
      lastScore: Number(score),
      lastAnswer: answer
    };
    window.localStorage.setItem(storageKey, JSON.stringify([...existing.filter((item) => item.id !== activeQuestion.id), nextItem]));
    setMessage(messages.saved);
  }

  async function copyQuizPrompt() {
    if (!activeQuestion) return;
    await navigator.clipboard.writeText(
      [
        "Quiz me on this paper question. Do not reveal the answer first.",
        "",
        `Question: ${activeQuestion.question}`,
        `Type: ${activeQuestion.type}`,
        `Difficulty: ${activeQuestion.difficulty}/5`,
        `Expected signals: ${activeQuestion.expectedSignals.join("; ") || "No signals recorded."}`,
        "",
        "After I answer, grade only the evidence in my answer and give one next action."
      ].join("\n")
    );
    setMessage(messages.copied);
  }

  if (questions.length === 0) {
    return (
      <div className="paper-empty-state" lang={locale}>
        <h2>{messages.empty}</h2>
        <p>{messages.emptyBody}</p>
      </div>
    );
  }

  return (
    <section className="learning-panel" aria-labelledby="question-practice-heading" lang={locale}>
      <div className="paper-filter-panel__header">
        <div>
          <p className="eyebrow">{messages.eyebrow}</p>
          <h2 id="question-practice-heading">{messages.title}</h2>
        </div>
        <button type="button" onClick={pickRandom}>
          {messages.random}
        </button>
      </div>

      <div className="paper-filter-grid">
        <label className="paper-field">
          <span>{messages.type}</span>
          <select
            value={activeType}
            onChange={(event) => {
              setActiveType(event.target.value);
              setActiveQuestionId("");
            }}
          >
            <option value="">{messages.allTypes}</option>
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="paper-field paper-field--wide">
          <span>{messages.select}</span>
          <select value={activeQuestion?.id ?? ""} onChange={(event) => setActiveQuestionId(event.target.value)}>
            {filteredQuestions.map((question) => (
              <option value={question.id} key={question.id}>
                {question.question}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeQuestion ? (
        <>
          <div className="learning-card">
            <h3>{activeQuestion.question}</h3>
            <p className="metadata">
              {activeQuestion.type} · {messages.difficulty} {activeQuestion.difficulty}/5 · {activeQuestion.source}
            </p>
          </div>
          <label className="learning-field">
            <span>{messages.answer}</span>
            <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={6} />
          </label>
          <label className="paper-field">
            <span>{messages.selfScore}</span>
            <select value={score} onChange={(event) => setScore(event.target.value)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option value={value} key={value}>
                  {value}/5
                </option>
              ))}
            </select>
          </label>
          <div className="learning-card">
            <h3>{messages.evidence}</h3>
            {activeQuestion.expectedSignals.length > 0 ? (
              <ul>
                {activeQuestion.expectedSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            ) : (
              <p>{messages.noEvidence}</p>
            )}
          </div>
          <div className="paper-card__links">
            <button type="button" onClick={saveLocalPractice}>
              {messages.save}
            </button>
            <button type="button" onClick={copyQuizPrompt}>
              {messages.copy}
            </button>
            <a href={`${locale === "ko" ? "/ko" : ""}/papers/${activeQuestion.paperSlug}/`}>{messages.openPaper}</a>
          </div>
        </>
      ) : null}

      {message ? <p className="metadata">{message}</p> : null}
    </section>
  );
}

function loadLocalState(): LocalQuestionState[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as LocalQuestionState[];
  } catch {
    return [];
  }
}
