import { useRef, useState } from "react";

interface Props {
  prompt: string;
  command: string;
  initiallyOpen?: boolean;
  triggerLabel?: string;
}

export default function ManualReviewPrompt({
  prompt,
  command,
  initiallyOpen = false,
  triggerLabel = "Re-review manually"
}: Props) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "selected" | "failed">("idle");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  async function copyPrompt() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(prompt);
          copied = true;
        } catch {
          // Fall through to selection-based copying for restricted browsers.
        }
      }

      if (!copied && promptRef.current) {
        promptRef.current.focus();
        promptRef.current.select();
        promptRef.current.setSelectionRange(0, prompt.length);
        setCopyState("selected");
        return;
      }

      if (!copied) throw new Error("Copy unavailable");
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="manual-review-prompt">
      {!initiallyOpen ? (
        <button type="button" className="manual-review-prompt__toggle" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "Hide manual prompt" : triggerLabel}
        </button>
      ) : null}

      {isOpen ? (
        <div className="manual-review-prompt__panel">
          <div className="manual-review-prompt__header">
            <div>
              <h3>Or copy manual review prompt</h3>
              <p>Paste this into ChatGPT or another model, then save the returned JSON review.</p>
            </div>
            <button type="button" onClick={copyPrompt}>
              Copy AI Review Prompt
            </button>
          </div>

          <p className="metadata">
            CLI option: <code>{command}</code>
          </p>

          <label className="paper-review-fallback__prompt">
            <span>Manual review prompt</span>
            <textarea ref={promptRef} readOnly value={prompt} />
          </label>

          {copyState === "copied" ? <p className="metadata">Prompt copied.</p> : null}
          {copyState === "selected" ? (
            <p className="metadata">Automatic copy was blocked. The full prompt is selected; press Ctrl+C or Cmd+C.</p>
          ) : null}
          {copyState === "failed" ? (
            <p className="metadata">Copy is unavailable. Select the prompt text manually.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
