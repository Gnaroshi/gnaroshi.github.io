import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ApiExamLanguage,
  ApiPaperContext,
  ApiTargetDepth,
  GeneratedOralExam,
  OralExamQuestion,
  ResearchApiConfig,
  ScoredOralExam
} from "../../types/api";
import {
  createRealtimeSession,
  generateOralExam,
  getResearchApiConfig,
  ResearchApiError,
  scoreOralExam
} from "../../utils/researchApiClient";
import ExamExportResult from "./ExamExportResult";
import ExamTranscriptPanel, { type ExamTranscriptEntry } from "./ExamTranscriptPanel";
import RealtimeExamSetup from "./RealtimeExamSetup";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

type Props = {
  apiBaseUrl: string;
  paperSlug: string;
  paperTitle: string;
  paperContext: ApiPaperContext;
  initialTargetDepth: ApiTargetDepth;
  manualPrompt: string;
  locale: Locale;
  messages: IslandMessages["exam"];
};

type Phase = "idle" | "connecting" | "live" | "generating" | "answering" | "scoring" | "scored" | "stopped" | "error";

export default function LiveOralExam({
  apiBaseUrl,
  paperSlug,
  paperTitle,
  paperContext,
  initialTargetDepth,
  manualPrompt,
  locale,
  messages
}: Props) {
  const [targetDepth, setTargetDepth] = useState<ApiTargetDepth>(initialTargetDepth);
  const [language, setLanguage] = useState<ApiExamLanguage>(locale === "ko" ? "ko-KR" : "en-US");
  const [questionCount, setQuestionCount] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [apiConfig, setApiConfig] = useState<ResearchApiConfig>();
  const [apiStatus, setApiStatus] = useState(apiBaseUrl ? messages.checking : messages.unavailable);
  const [errorMessage, setErrorMessage] = useState("");
  const [transcript, setTranscript] = useState<ExamTranscriptEntry[]>([]);
  const [generatedExam, setGeneratedExam] = useState<GeneratedOralExam>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<ScoredOralExam>();
  const [manualCopyState, setManualCopyState] = useState("");
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const manualPromptRef = useRef<HTMLTextAreaElement>(null);
  const liveExamIdRef = useRef("");

  const closeRealtime = useCallback(() => {
    channelRef.current?.close();
    peerRef.current?.close();
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    if (audioRef.current) audioRef.current.srcObject = null;
    channelRef.current = null;
    peerRef.current = null;
    mediaRef.current = null;
  }, []);

  useEffect(() => {
    if (!apiBaseUrl) return;
    let active = true;
    getResearchApiConfig(apiBaseUrl)
      .then((config) => {
        if (!active) return;
        setApiConfig(config);
        setApiStatus(config.realtimeEnabled ? messages.ready : messages.manualAvailable);
      })
      .catch((error) => {
        if (!active) return;
        setApiStatus(toMessage(error, messages));
      });
    return () => {
      active = false;
    };
  }, [apiBaseUrl]);

  useEffect(() => closeRealtime, [closeRealtime]);

  const busy = ["connecting", "generating", "scoring"].includes(phase);
  const live = phase === "connecting" || phase === "live";
  const transcriptText = useMemo(
    () => transcript.map((entry) => `${entry.role === "examiner" ? messages.examiner : messages.you}: ${entry.text}`).join("\n\n"),
    [messages.examiner, messages.you, transcript]
  );

  async function startLiveExam() {
    if (!apiBaseUrl || !apiConfig?.realtimeEnabled) return;
    setPhase("connecting");
    setErrorMessage("");
    setScore(undefined);
    setTranscript([]);
    setGeneratedExam(undefined);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = media;
      const session = await createRealtimeSession(apiBaseUrl, {
        paperSlug,
        paperTitle,
        targetDepth,
        language,
        examMode: "oral",
        questionCount,
        paperContext
      });
      liveExamIdRef.current = session.sessionId;
      const peer = new RTCPeerConnection();
      peerRef.current = peer;
      peer.ontrack = (event) => {
        if (audioRef.current) audioRef.current.srcObject = event.streams[0];
      };
      peer.onconnectionstatechange = () => {
        if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
          setApiStatus(format(messages.connection, { state: peer.connectionState }));
        }
      };
      media.getTracks().forEach((track) => peer.addTrack(track, media));
      const channel = peer.createDataChannel("oai-events");
      channelRef.current = channel;
      channel.onmessage = handleRealtimeEvent;
      channel.onerror = () => setErrorMessage(messages.eventError);
      channel.onopen = () => {
        channel.send(JSON.stringify({
          type: "response.create",
          response: { instructions: `Begin the oral exam now with this opening prompt: ${session.examPlan.openingPrompt}` }
        }));
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      if (!offer.sdp) throw new Error(messages.noOffer);
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${session.realtime.clientSecret}`,
          "Content-Type": "application/sdp"
        }
      });
      if (!sdpResponse.ok) throw new Error(messages.rejectedOffer);
      await peer.setRemoteDescription({ type: "answer", sdp: await sdpResponse.text() });
      setApiStatus(format(messages.connectedMinutes, { minutes: session.examPlan.estimatedMinutes }));
      setPhase("live");
    } catch (error) {
      closeRealtime();
      setErrorMessage(toMessage(error, messages));
      setPhase("error");
    }
  }

  function stopLiveExam() {
    closeRealtime();
    setApiStatus(messages.stopped);
    setPhase("stopped");
  }

  function handleRealtimeEvent(message: MessageEvent<string>) {
    try {
      const event = JSON.parse(message.data) as Record<string, unknown>;
      const type = String(event.type ?? "");
      const text = typeof event.transcript === "string" ? event.transcript : typeof event.text === "string" ? event.text : "";
      if (!text.trim()) {
        if (type === "error") setErrorMessage(messages.examinerError);
        return;
      }
      if (type === "conversation.item.input_audio_transcription.completed") {
        appendTranscript("user", text, event);
      } else if (type === "response.output_audio_transcript.done" || type === "response.output_text.done") {
        appendTranscript("examiner", text, event);
      }
    } catch {
      setErrorMessage(messages.unreadable);
    }
  }

  function appendTranscript(role: ExamTranscriptEntry["role"], text: string, event: Record<string, unknown>) {
    const eventKey = String(event.event_id ?? event.item_id ?? event.response_id ?? crypto.randomUUID());
    const entry = { id: `${role}-${eventKey}`, role, text: text.trim() };
    setTranscript((current) => current.some((item) => item.id === entry.id || (item.role === role && item.text === entry.text)) ? current : [...current, entry]);
  }

  async function generateTextFallback() {
    if (!apiBaseUrl) return;
    setPhase("generating");
    setErrorMessage("");
    setScore(undefined);
    try {
      const exam = await generateOralExam(apiBaseUrl, {
        paperSlug,
        paperTitle,
        targetDepth,
        language,
        questionCount,
        paperContext
      });
      setGeneratedExam(exam);
      setAnswers(exam.questions.map(() => ""));
      setTranscript([]);
      setApiStatus(exam.mock ? messages.mockLoaded : messages.textLoaded);
      setPhase("answering");
    } catch (error) {
      setErrorMessage(toMessage(error, messages));
      setPhase("error");
    }
  }

  async function scoreTextExam() {
    if (!generatedExam) return;
    const entries = generatedExam.questions.flatMap((question, index): ExamTranscriptEntry[] => [
      { id: `question-${question.id}`, role: "examiner", text: question.prompt },
      { id: `answer-${question.id}`, role: "user", text: answers[index] ?? "" }
    ]);
    setTranscript(entries);
    await requestScore(generatedExam.examId, generatedExam.questions, answers, formatTranscript(entries, messages));
  }

  async function scoreLiveExam() {
    const questions = transcript
      .filter((entry) => entry.role === "examiner")
      .map((entry): OralExamQuestion => ({
        id: entry.id,
        type: "retrieval",
        prompt: entry.text,
        expectedSignals: [],
        difficulty: targetDepth === "pass3" ? 4 : targetDepth === "pass2" ? 3 : 2,
        followUpPrompt: ""
      }));
    const liveAnswers = transcript.filter((entry) => entry.role === "user").map((entry) => entry.text);
    await requestScore(liveExamIdRef.current || crypto.randomUUID(), questions, liveAnswers, transcriptText);
  }

  async function requestScore(examId: string, questions: OralExamQuestion[], answerValues: string[], transcriptValue: string) {
    if (!apiBaseUrl) return;
    setPhase("scoring");
    setErrorMessage("");
    try {
      const result = await scoreOralExam(apiBaseUrl, {
        paperSlug,
        paperTitle,
        examId,
        targetDepth,
        language,
        questions,
        answers: answerValues,
        transcript: transcriptValue,
        paperContext
      });
      setScore(result);
      setPhase("scored");
    } catch (error) {
      setErrorMessage(toMessage(error, messages));
      setPhase("error");
    }
  }

  async function copyManualPrompt() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(manualPrompt);
          copied = true;
        } catch {
          // Fall through to selection-based copying for restricted browsers.
        }
      }

      if (!copied && manualPromptRef.current) {
        manualPromptRef.current.focus();
        manualPromptRef.current.select();
        manualPromptRef.current.setSelectionRange(0, manualPrompt.length);
        setManualCopyState(messages.copyBlocked);
        return;
      }

      if (!copied) throw new Error("Copy unavailable");
      setManualCopyState(messages.promptCopied);
    } catch {
      setManualCopyState(messages.copyBlocked);
    }
  }

  return (
    <div className="live-exam" lang={locale}>
      <section className="live-exam-principles" aria-label={messages.principlesLabel}>
        {messages.principles.map((principle) => <p key={principle}>{principle}</p>)}
      </section>

      <RealtimeExamSetup
        targetDepth={targetDepth}
        language={language}
        questionCount={questionCount}
        config={apiConfig}
        apiConfigured={Boolean(apiBaseUrl)}
        busy={busy}
        live={live}
        messages={messages}
        onTargetDepthChange={setTargetDepth}
        onLanguageChange={setLanguage}
        onQuestionCountChange={(value) => setQuestionCount(Math.min(12, Math.max(3, value || 3)))}
        onStartLive={startLiveExam}
        onStopLive={stopLiveExam}
        onGenerateText={generateTextFallback}
      />

      <p className="live-exam-status" aria-live="polite">{apiStatus}</p>
      {errorMessage ? <p className="live-exam-error" role="alert">{errorMessage}</p> : null}
      <audio ref={audioRef} autoPlay aria-label={messages.voiceLabel} />
      <p className="metadata">{messages.privacy}</p>

      {generatedExam ? (
        <section className="text-exam" aria-labelledby="text-exam-heading">
          <header>
            <div>
              <p className="eyebrow">{messages.textFallback}</p>
              <h2 id="text-exam-heading">{messages.answerMemory}</h2>
            </div>
            {generatedExam.mock ? <span>{messages.developmentMock}</span> : null}
          </header>
          <ol>
            {generatedExam.questions.map((question, index) => (
              <li key={question.id}>
                <label className="learning-field">
                  <strong>{question.prompt}</strong>
                  <textarea
                    rows={5}
                    value={answers[index] ?? ""}
                    onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))}
                  />
                </label>
              </li>
            ))}
          </ol>
          <button type="button" onClick={scoreTextExam} disabled={busy}>{messages.scoreText}</button>
        </section>
      ) : null}

      {(transcript.length > 0 || live) ? <ExamTranscriptPanel entries={transcript} live={live} messages={messages} /> : null}
      {!live && transcript.length > 0 && !generatedExam && !score ? (
        <button type="button" onClick={scoreLiveExam} disabled={busy}>{messages.scoreStopped}</button>
      ) : null}
      {score ? <ExamExportResult paperSlug={paperSlug} result={score} transcript={transcript} messages={messages} /> : null}

      <section className="manual-exam" aria-labelledby="manual-exam-heading">
        <div>
          <p className="eyebrow">{messages.noApi}</p>
          <h2 id="manual-exam-heading">{messages.manualTitle}</h2>
          <p>{messages.manualBody}</p>
        </div>
        <div className="paper-card__links">
          <button type="button" onClick={copyManualPrompt}>{messages.copyManual}</button>
        </div>
        <label className="learning-field">
          <span>{messages.manualPrompt}</span>
          <textarea ref={manualPromptRef} readOnly rows={14} value={manualPrompt} />
        </label>
        {manualCopyState ? <p className="metadata" aria-live="polite">{manualCopyState}</p> : null}
      </section>
    </div>
  );
}

function formatTranscript(entries: ExamTranscriptEntry[], messages: IslandMessages["exam"]): string {
  return entries.map((entry) => `${entry.role === "examiner" ? messages.examiner : messages.you}: ${entry.text}`).join("\n\n");
}

function toMessage(error: unknown, messages: IslandMessages["exam"]): string {
  if (error instanceof ResearchApiError) return error.message;
  if (error instanceof DOMException && error.name === "NotAllowedError") return messages.microphoneDenied;
  return error instanceof Error ? error.message : messages.startError;
}

function format(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), template);
}
