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

type Props = {
  apiBaseUrl: string;
  paperSlug: string;
  paperTitle: string;
  paperContext: ApiPaperContext;
  initialTargetDepth: ApiTargetDepth;
  manualPrompt: string;
};

type Phase = "idle" | "connecting" | "live" | "generating" | "answering" | "scoring" | "scored" | "stopped" | "error";

export default function LiveOralExam({
  apiBaseUrl,
  paperSlug,
  paperTitle,
  paperContext,
  initialTargetDepth,
  manualPrompt
}: Props) {
  const [targetDepth, setTargetDepth] = useState<ApiTargetDepth>(initialTargetDepth);
  const [language, setLanguage] = useState<ApiExamLanguage>("ko-KR");
  const [questionCount, setQuestionCount] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [apiConfig, setApiConfig] = useState<ResearchApiConfig>();
  const [apiStatus, setApiStatus] = useState(apiBaseUrl ? "Checking live voice availability…" : "Live voice is unavailable in this deployment.");
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
        setApiStatus(config.realtimeEnabled ? "Live voice is ready." : "Live voice is currently unavailable. Manual practice remains available.");
      })
      .catch((error) => {
        if (!active) return;
        setApiStatus(toMessage(error));
      });
    return () => {
      active = false;
    };
  }, [apiBaseUrl]);

  useEffect(() => closeRealtime, [closeRealtime]);

  const busy = ["connecting", "generating", "scoring"].includes(phase);
  const live = phase === "connecting" || phase === "live";
  const transcriptText = useMemo(
    () => transcript.map((entry) => `${entry.role === "examiner" ? "Examiner" : "User"}: ${entry.text}`).join("\n\n"),
    [transcript]
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
          setApiStatus(`Realtime connection ${peer.connectionState}.`);
        }
      };
      media.getTracks().forEach((track) => peer.addTrack(track, media));
      const channel = peer.createDataChannel("oai-events");
      channelRef.current = channel;
      channel.onmessage = handleRealtimeEvent;
      channel.onerror = () => setErrorMessage("The realtime event channel reported an error.");
      channel.onopen = () => {
        channel.send(JSON.stringify({
          type: "response.create",
          response: { instructions: `Begin the oral exam now with this opening prompt: ${session.examPlan.openingPrompt}` }
        }));
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      if (!offer.sdp) throw new Error("The browser did not create a WebRTC offer.");
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${session.realtime.clientSecret}`,
          "Content-Type": "application/sdp"
        }
      });
      if (!sdpResponse.ok) throw new Error("OpenAI rejected the WebRTC session offer.");
      await peer.setRemoteDescription({ type: "answer", sdp: await sdpResponse.text() });
      setApiStatus(`Live session connected · about ${session.examPlan.estimatedMinutes} minutes`);
      setPhase("live");
    } catch (error) {
      closeRealtime();
      setErrorMessage(toMessage(error));
      setPhase("error");
    }
  }

  function stopLiveExam() {
    closeRealtime();
    setApiStatus("Live session stopped. The transcript remains only in this browser tab.");
    setPhase("stopped");
  }

  function handleRealtimeEvent(message: MessageEvent<string>) {
    try {
      const event = JSON.parse(message.data) as Record<string, unknown>;
      const type = String(event.type ?? "");
      const text = typeof event.transcript === "string" ? event.transcript : typeof event.text === "string" ? event.text : "";
      if (!text.trim()) {
        if (type === "error") setErrorMessage("The realtime examiner returned an error event.");
        return;
      }
      if (type === "conversation.item.input_audio_transcription.completed") {
        appendTranscript("user", text, event);
      } else if (type === "response.output_audio_transcript.done" || type === "response.output_text.done") {
        appendTranscript("examiner", text, event);
      }
    } catch {
      setErrorMessage("A realtime event could not be read.");
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
      setApiStatus(exam.mock ? "Development mock questions loaded." : "Text exam loaded.");
      setPhase("answering");
    } catch (error) {
      setErrorMessage(toMessage(error));
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
    await requestScore(generatedExam.examId, generatedExam.questions, answers, formatTranscript(entries));
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
      setErrorMessage(toMessage(error));
      setPhase("error");
    }
  }

  async function copyManualPrompt() {
    try {
      await navigator.clipboard.writeText(manualPrompt);
      setManualCopyState("Manual oral exam prompt copied.");
    } catch {
      setManualCopyState("Copy failed. Select the prompt manually below.");
    }
  }

  return (
    <div className="live-exam">
      <section className="live-exam-principles" aria-label="Live oral exam principles">
        <p>This score measures retrieval evidence, not intelligence.</p>
        <p>You can stop anytime and export your transcript.</p>
        <p>The examiner asks one question at a time.</p>
        <p>Use Korean or English.</p>
      </section>

      <RealtimeExamSetup
        targetDepth={targetDepth}
        language={language}
        questionCount={questionCount}
        config={apiConfig}
        apiConfigured={Boolean(apiBaseUrl)}
        busy={busy}
        live={live}
        onTargetDepthChange={setTargetDepth}
        onLanguageChange={setLanguage}
        onQuestionCountChange={(value) => setQuestionCount(Math.min(12, Math.max(3, value || 3)))}
        onStartLive={startLiveExam}
        onStopLive={stopLiveExam}
        onGenerateText={generateTextFallback}
      />

      <p className="live-exam-status" aria-live="polite">{apiStatus}</p>
      {errorMessage ? <p className="live-exam-error" role="alert">{errorMessage}</p> : null}
      <audio ref={audioRef} autoPlay aria-label="AI-generated examiner voice" />
      <p className="metadata">The examiner voice is AI-generated, not a human voice. Audio and transcript are not persisted by this page.</p>

      {generatedExam ? (
        <section className="text-exam" aria-labelledby="text-exam-heading">
          <header>
            <div>
              <p className="eyebrow">Text fallback</p>
              <h2 id="text-exam-heading">Answer from memory</h2>
            </div>
            {generatedExam.mock ? <span>Development mock</span> : null}
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
          <button type="button" onClick={scoreTextExam} disabled={busy}>Score text answers</button>
        </section>
      ) : null}

      {(transcript.length > 0 || live) ? <ExamTranscriptPanel entries={transcript} live={live} /> : null}
      {!live && transcript.length > 0 && !generatedExam && !score ? (
        <button type="button" onClick={scoreLiveExam} disabled={busy}>Score stopped live exam</button>
      ) : null}
      {score ? <ExamExportResult paperSlug={paperSlug} result={score} transcript={transcript} /> : null}

      <section className="manual-exam" aria-labelledby="manual-exam-heading">
        <div>
          <p className="eyebrow">No-API workflow</p>
          <h2 id="manual-exam-heading">Run the exam manually</h2>
          <p>Copy the prompt into ChatGPT or another model. Keep the transcript local, then export returned score JSON into the repository workflow.</p>
        </div>
        <div className="paper-card__links">
          <button type="button" onClick={copyManualPrompt}>Copy manual oral exam prompt</button>
        </div>
        <label className="learning-field">
          <span>Manual exam prompt</span>
          <textarea readOnly rows={14} value={manualPrompt} />
        </label>
        {manualCopyState ? <p className="metadata" aria-live="polite">{manualCopyState}</p> : null}
      </section>
    </div>
  );
}

function formatTranscript(entries: ExamTranscriptEntry[]): string {
  return entries.map((entry) => `${entry.role === "examiner" ? "Examiner" : "User"}: ${entry.text}`).join("\n\n");
}

function toMessage(error: unknown): string {
  if (error instanceof ResearchApiError) return error.message;
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Microphone permission was not granted.";
  return error instanceof Error ? error.message : "The oral exam could not be started.";
}
