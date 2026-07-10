export type ExamTranscriptEntry = {
  id: string;
  role: "examiner" | "user";
  text: string;
};

type Props = {
  entries: ExamTranscriptEntry[];
  live: boolean;
};

export default function ExamTranscriptPanel({ entries, live }: Props) {
  return (
    <section className="exam-transcript" aria-labelledby="exam-transcript-heading" aria-live="polite">
      <header>
        <div>
          <p className="eyebrow">Transcript</p>
          <h2 id="exam-transcript-heading">{live ? "Live conversation" : "Recorded locally"}</h2>
        </div>
        <span>{entries.length} turns</span>
      </header>
      {entries.length > 0 ? (
        <ol>
          {entries.map((entry) => (
            <li className={`exam-transcript__entry exam-transcript__entry--${entry.role}`} key={entry.id}>
              <strong>{entry.role === "examiner" ? "Examiner" : "You"}</strong>
              <p>{entry.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">Transcript events will appear here during a live exam.</p>
      )}
    </section>
  );
}
