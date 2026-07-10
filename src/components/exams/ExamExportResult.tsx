import { useMemo, useState } from "react";
import type { ScoredOralExam } from "../../types/api";
import type { ExamTranscriptEntry } from "./ExamTranscriptPanel";

type Props = {
  paperSlug: string;
  result: ScoredOralExam;
  transcript: ExamTranscriptEntry[];
};

export default function ExamExportResult({ paperSlug, result, transcript }: Props) {
  const [message, setMessage] = useState("");
  const resultJson = useMemo(() => JSON.stringify(result, null, 2), [result]);
  const transcriptText = useMemo(
    () => transcript.map((entry) => `${entry.role === "examiner" ? "Examiner" : "User"}: ${entry.text}`).join("\n\n"),
    [transcript]
  );

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied.`);
    } catch {
      setMessage(`Could not copy ${label.toLowerCase()}. Select it manually below.`);
    }
  }

  function download(value: string, filename: string, type: string) {
    const url = URL.createObjectURL(new Blob([value], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(`${filename} prepared locally.`);
  }

  const date = result.scoredAt.slice(0, 10);
  return (
    <section className="exam-result" aria-labelledby="exam-result-heading">
      <header>
        <div>
          <p className="eyebrow">Exam result</p>
          <h2 id="exam-result-heading">Retrieval evidence: {result.overallScore}/100</h2>
        </div>
        <span>{result.confidence} confidence</span>
      </header>
      {result.mock ? <p className="exam-result__warning">Development mock. This score did not evaluate correctness.</p> : null}
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
        <button type="button" onClick={() => copy(resultJson, "Score JSON")}>Copy score JSON</button>
        <button type="button" onClick={() => copy(transcriptText, "Transcript")}>Copy transcript</button>
        <button type="button" onClick={() => download(resultJson, `${date}-${paperSlug}-oral-exam.json`, "application/json")}>Export score JSON</button>
        <button type="button" onClick={() => download(transcriptText, `${date}-${paperSlug}-transcript.txt`, "text/plain")}>Export transcript</button>
      </div>
      <p className="metadata">
        Keep the result local, or add it to the research record before the next update.
      </p>
      {message ? <p className="metadata" aria-live="polite">{message}</p> : null}
      <details>
        <summary>Review score JSON</summary>
        <pre><code>{resultJson}</code></pre>
      </details>
    </section>
  );
}

function formatLabel(value: string): string {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
