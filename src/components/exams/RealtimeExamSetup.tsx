import type { ApiExamLanguage, ApiTargetDepth, ResearchApiConfig } from "../../types/api";
import type { IslandMessages } from "../../i18n/islands";

type Props = {
  targetDepth: ApiTargetDepth;
  language: ApiExamLanguage;
  questionCount: number;
  config?: ResearchApiConfig;
  apiConfigured: boolean;
  busy: boolean;
  live: boolean;
  messages: IslandMessages["exam"];
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
  messages,
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
        <p className="eyebrow">{messages.setup}</p>
        <h2 id="live-exam-setup-heading">{messages.setupHeading}</h2>
      </div>

      <div className="live-exam-control-grid">
        <label className="paper-field">
          <span>{messages.targetDepth}</span>
          <select value={targetDepth} onChange={(event) => onTargetDepthChange(event.target.value as ApiTargetDepth)} disabled={live || busy}>
            <option value="pass1">{messages.pass1}</option>
            <option value="pass2">{messages.pass2}</option>
            <option value="pass3">{messages.pass3}</option>
          </select>
        </label>
        <label className="paper-field">
          <span>{messages.language}</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as ApiExamLanguage)} disabled={live || busy}>
            <option value="ko-KR">{messages.korean}</option>
            <option value="en-US">{messages.english}</option>
          </select>
        </label>
        <label className="paper-field">
          <span>{messages.questions}</span>
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
          <button type="button" onClick={onStopLive}>{messages.stopLive}</button>
        ) : (
          <button type="button" onClick={onStartLive} disabled={!realtimeReady || busy}>
            {messages.startLive}
          </button>
        )}
        <button type="button" onClick={onGenerateText} disabled={!apiConfigured || busy || live}>
          {messages.generateText}
        </button>
      </div>

      <p className="metadata">
        {!apiConfigured
          ? messages.voiceUnavailable
          : config?.realtimeEnabled
            ? messages.microphoneReady
            : messages.textOrManual}
      </p>
    </section>
  );
}
