import { useMemo, useState } from "react";
import type { ScoredOralExam } from "../../types/api";
import type { ExamTranscriptEntry } from "./ExamTranscriptPanel";
import type { IslandMessages } from "../../i18n/islands";

type Props = {
  paperSlug: string;
  result: ScoredOralExam;
  transcript: ExamTranscriptEntry[];
  messages: IslandMessages["exam"];
};

export default function ExamExportResult({ paperSlug, result, transcript, messages }: Props) {
  const [message, setMessage] = useState("");
  const resultJson = useMemo(() => JSON.stringify(result, null, 2), [result]);
  const transcriptText = useMemo(
    () => transcript.map((entry) => `${entry.role === "examiner" ? "Examiner" : "User"}: ${entry.text}`).join("\n\n"),
    [transcript]
  );

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(messages.copied.replace("{label}", label));
    } catch {
      setMessage(messages.copyFailed.replace("{label}", label.toLowerCase()));
    }
  }

  function download(value: string, filename: string, type: string) {
    const url = URL.createObjectURL(new Blob([value], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(messages.prepared.replace("{filename}", filename));
  }

  const date = result.scoredAt.slice(0, 10);
  return (
    <section className="exam-result" aria-labelledby="exam-result-heading">
      <header>
        <div>
          <p className="eyebrow">{messages.result}</p>
          <h2 id="exam-result-heading">{messages.retrievalEvidence.replace("{score}", String(result.overallScore))}</h2>
        </div>
        <span>{messages.confidence.replace("{value}", result.confidence)}</span>
      </header>
      {result.mock ? <p className="exam-result__warning">{messages.mockWarning}</p> : null}
      <p>{result.summary}</p>
      <div className="exam-result__dimensions">
        {Object.entries(result.scores).map(([name, dimension]) => (
          <article key={name}>
            <strong>{formatLabel(name)} {dimension.score}</strong>
            <p>{dimension.feedback}</p>
          </article>
        ))}
      </div>
      <div className="paper-card__links">
        <button type="button" onClick={() => copy(resultJson, "Score JSON")}>{messages.copyScore}</button>
        <button type="button" onClick={() => copy(transcriptText, "Transcript")}>{messages.copyTranscript}</button>
        <button type="button" onClick={() => download(resultJson, `${date}-${paperSlug}-oral-exam.json`, "application/json")}>{messages.exportScore}</button>
        <button type="button" onClick={() => download(transcriptText, `${date}-${paperSlug}-transcript.txt`, "text/plain")}>{messages.exportTranscript}</button>
      </div>
      <p className="metadata">
        {messages.keepLocal}
      </p>
      {message ? <p className="metadata" aria-live="polite">{message}</p> : null}
      <details>
        <summary>{messages.reviewJson}</summary>
        <pre><code>{resultJson}</code></pre>
      </details>
    </section>
  );
}

function formatLabel(value: string): string {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
