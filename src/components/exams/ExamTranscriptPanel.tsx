export type ExamTranscriptEntry = {
  id: string;
  role: "examiner" | "user";
  text: string;
};

type Props = {
  entries: ExamTranscriptEntry[];
  live: boolean;
  messages: IslandMessages["exam"];
};

export default function ExamTranscriptPanel({ entries, live, messages }: Props) {
  return (
    <section className="exam-transcript" aria-labelledby="exam-transcript-heading" aria-live="polite">
      <header>
        <div>
          <p className="eyebrow">{messages.transcript}</p>
          <h2 id="exam-transcript-heading">{live ? messages.liveConversation : messages.recordedLocal}</h2>
        </div>
        <span>{messages.turns.replace("{count}", String(entries.length))}</span>
      </header>
      {entries.length > 0 ? (
        <ol>
          {entries.map((entry) => (
            <li className={`exam-transcript__entry exam-transcript__entry--${entry.role}`} key={entry.id}>
              <strong>{entry.role === "examiner" ? messages.examiner : messages.you}</strong>
              <p>{entry.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">{messages.transcriptEmpty}</p>
      )}
    </section>
  );
}
import type { IslandMessages } from "../../i18n/islands";
