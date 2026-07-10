import { useRef, useState } from "react";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

interface Props {
  prompt: string;
  command: string;
  initiallyOpen?: boolean;
  triggerLabel?: string;
  locale: Locale;
  messages: IslandMessages["manualReview"];
}

export default function ManualReviewPrompt({
  prompt,
  command,
  locale,
  messages,
  initiallyOpen = false,
  triggerLabel
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
    <div className="manual-review-prompt" lang={locale}>
      {!initiallyOpen ? (
        <button type="button" className="manual-review-prompt__toggle" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? messages.hide : (triggerLabel ?? messages.rereview)}
        </button>
      ) : null}

      {isOpen ? (
        <div className="manual-review-prompt__panel">
          <div className="manual-review-prompt__header">
            <div>
              <h3>{messages.title}</h3>
              <p>{messages.body}</p>
            </div>
            <button type="button" onClick={copyPrompt}>
              {messages.copy}
            </button>
          </div>

          <p className="metadata">
            {messages.cli}: <code>{command}</code>
          </p>

          <label className="paper-review-fallback__prompt">
            <span>{messages.prompt}</span>
            <textarea ref={promptRef} readOnly value={prompt} />
          </label>

          {copyState === "copied" ? <p className="metadata">{messages.copied}</p> : null}
          {copyState === "selected" ? (
            <p className="metadata">{messages.selected}</p>
          ) : null}
          {copyState === "failed" ? (
            <p className="metadata">{messages.failed}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
