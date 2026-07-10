import type { ApiExamLanguage, ApiTargetDepth, ResearchApiConfig } from "../../types/api";

type Props = {
  targetDepth: ApiTargetDepth;
  language: ApiExamLanguage;
  questionCount: number;
  config?: ResearchApiConfig;
  apiConfigured: boolean;
  busy: boolean;
  live: boolean;
  onTargetDepthChange(value: ApiTargetDepth): void;
  onLanguageChange(value: ApiExamLanguage): void;
  onQuestionCountChange(value: number): void;
  onStartLive(): void;
  onStopLive(): void;
  onGenerateText(): void;
};

export default function RealtimeExamSetup({
  targetDepth,
  language,
  questionCount,
  config,
  apiConfigured,
  busy,
  live,
  onTargetDepthChange,
  onLanguageChange,
  onQuestionCountChange,
  onStartLive,
  onStopLive,
  onGenerateText
}: Props) {
  const realtimeReady = apiConfigured && config?.realtimeEnabled === true;

  return (
    <section className="live-exam-setup" aria-labelledby="live-exam-setup-heading">
      <div>
        <p className="eyebrow">Exam setup</p>
        <h2 id="live-exam-setup-heading">Choose the evidence depth</h2>
      </div>

      <div className="live-exam-control-grid">
        <label className="paper-field">
          <span>Target depth</span>
          <select value={targetDepth} onChange={(event) => onTargetDepthChange(event.target.value as ApiTargetDepth)} disabled={live || busy}>
            <option value="pass1">Pass 1 — relevance</option>
            <option value="pass2">Pass 2 — structure</option>
            <option value="pass3">Pass 3 — deep understanding</option>
          </select>
        </label>
        <label className="paper-field">
          <span>Language</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as ApiExamLanguage)} disabled={live || busy}>
            <option value="ko-KR">Korean</option>
            <option value="en-US">English</option>
          </select>
        </label>
        <label className="paper-field">
          <span>Questions</span>
          <input
            type="number"
            min={3}
            max={12}
            value={questionCount}
            onChange={(event) => onQuestionCountChange(Number(event.target.value))}
            disabled={live || busy}
          />
        </label>
      </div>

      <div className="paper-card__links">
        {live ? (
          <button type="button" onClick={onStopLive}>Stop live exam</button>
        ) : (
          <button type="button" onClick={onStartLive} disabled={!realtimeReady || busy}>
            Start live oral exam
          </button>
        )}
        <button type="button" onClick={onGenerateText} disabled={!apiConfigured || busy || live}>
          Generate text exam
        </button>
      </div>

      <p className="metadata">
        {!apiConfigured
          ? "Live voice is unavailable in this deployment. Manual practice remains available below."
          : config?.realtimeEnabled
            ? "Live voice is available. Microphone access is requested only when the exam starts."
            : "Live voice is currently unavailable. Text or manual practice can still be used."}
      </p>
    </section>
  );
}
