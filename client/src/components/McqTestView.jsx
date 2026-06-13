import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Trophy,
  AlertTriangle,
  Maximize2,
  Tags,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, "0");

const formatTime = (ms) => {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

/* ─── Component ───────────────────────────────────────── */
const McqTestView = ({
  test,
  selectedQuestion,
  mcqAnswers,
  savedMcqAnswers,
  savingAnswer,
  showInstructions,
  showSubmitConfirm,
  onStart,
  onSelectQuestion,
  onSelectOption,
  onSaveAndNext,
  onSubmitClick,       // opens the confirm dialog
  onCancelSubmit,
  onConfirmSubmit,     // performs the actual submit
  testId,              // used as localStorage key
  endTime,             // synchronized endTime from backend
}) => {
  const currentQuestion = test.questions[selectedQuestion];
  const totalQ = test.questions.length;
  const answeredCount = savedMcqAnswers.filter(
    (a) => typeof a === "number"
  ).length;

  /* ── Fullscreen state ───────────────────────────────── */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hasEnteredFullscreenRef = useRef(false);

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);

      if (!showInstructions && !active && hasEnteredFullscreenRef.current) {
        // User exited fullscreen during the active test -> auto submit
        const storageKey = `mcq_end_${testId}`;
        localStorage.removeItem(storageKey);
        onConfirmSubmit();
      }

      if (active) {
        hasEnteredFullscreenRef.current = true;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    // Initial check
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isCurrentlyFullscreen);
    if (isCurrentlyFullscreen) {
      hasEnteredFullscreenRef.current = true;
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [showInstructions, testId, onConfirmSubmit]);

  const handleStartTest = () => {
    onStart();
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.log("Fullscreen request failed", err));
    }
  };

  const handleConfirmSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log("Exit fullscreen failed", err));
    }
    onConfirmSubmit();
  };

  /* ── Timer state ───────────────────────────────────── */
  const [timeLeft, setTimeLeft] = useState(null); // ms remaining
  const timerRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  // Start / restore the countdown once the test begins
  const startTimer = () => {
    const storageKey = `mcq_end_${testId}`;
    const durationMs = test.duration * 60 * 1000; // duration is in minutes for MCQ

    let calculatedEndTime = null;
    if (endTime) {
      calculatedEndTime = new Date(endTime).getTime();
    } else {
      calculatedEndTime = Number(localStorage.getItem(storageKey));
      if (!calculatedEndTime || calculatedEndTime < Date.now()) {
        // Fresh start
        calculatedEndTime = Date.now() + durationMs;
      }
    }
    // Update localStorage for consistency
    localStorage.setItem(storageKey, String(calculatedEndTime));

    const tick = () => {
      const diff = calculatedEndTime - Date.now();
      if (diff <= 0) {
        clearInterval(timerRef.current);
        setTimeLeft(0);
        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          localStorage.removeItem(storageKey);
          if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.log("Exit fullscreen failed", err));
          }
          onConfirmSubmit(); // auto-submit
        }
        return;
      }
      setTimeLeft(diff);
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // When instructions are dismissed, kick off the timer
  useEffect(() => {
    if (!showInstructions && !timerRef.current) {
      startTimer();
    }
  }, [showInstructions, endTime]);

  /* ── Timer colour ──────────────────────────────────── */
  const timerColor =
    timeLeft === null
      ? "text-base-content"
      : timeLeft < 60_000
      ? "text-error animate-pulse"   // < 1 min — red pulse
      : timeLeft < 5 * 60_000
      ? "text-warning"               // < 5 min — amber
      : "text-success";              // plenty of time — green

  /* ── Submit confirm message ────────────────────────── */
  const submitMessage =
    `You have answered ${answeredCount} out of ${totalQ} question${totalQ !== 1 ? "s" : ""}.\n` +
    (answeredCount < totalQ
      ? `${totalQ - answeredCount} question${totalQ - answeredCount !== 1 ? "s" : ""} are still unanswered. Are you sure you want to submit?`
      : "All questions answered! Are you sure you want to submit?");

  /* ── Render ─────────────────────────────────────────── */
  return (
    <>
      {/* ── Instructions Modal ─────────────────────────── */}
      {showInstructions && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-6 text-primary-content">
              <h2 className="text-3xl font-extrabold">{test.topicName}</h2>
              <p className="mt-1 opacity-80 text-sm">MCQ Assessment</p>

              {test.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Tags size={14} />
                  {test.topics.map((t) => (
                    <span
                      key={t._id || t.name}
                      className="badge badge-outline border-primary-content/40 text-primary-content rounded-md px-2 py-1 text-[11px] font-medium"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pb-0">
              <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex items-center gap-3">
                <Trophy size={20} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/60">Full Marks</p>
                  <h3 className="text-xl font-bold">{test.fullMarks}</h3>
                </div>
              </div>

              <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex items-center gap-3">
                <Clock3 size={20} className="text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-base-content/60">Duration</p>
                  <h3 className="text-xl font-bold">{test.duration} Minutes</h3>
                </div>
              </div>

              <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-success shrink-0" />
                <div>
                  <p className="text-xs text-base-content/60">Questions</p>
                  <h3 className="text-xl font-bold">{totalQ}</h3>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="px-6 py-5">
              {test.instructions?.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm text-base-content/70 mb-2 uppercase tracking-wide">
                    Instructions
                  </h4>
                  <div className="bg-base-200 border border-base-300 rounded-xl p-4 max-h-48 overflow-y-auto mb-5">
                    <ul className="space-y-2">
                      {test.instructions.map((instr, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{instr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Clock3 size={16} className="text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-warning font-medium">
                  The test will auto-submit when the timer reaches 00:00:00 or if you exit fullscreen mode.
                  Fullscreen mode is required during the test.
                </p>
              </div>

              <button
                onClick={handleStartTest}
                className="btn btn-primary w-full h-12 rounded-xl text-base"
              >
                <Maximize2 size={16} />
                I Understand, Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Full-Screen Test Area ───────────────────────── */}
      {/* Covers the ENTIRE viewport (z-40 sits above the sticky navbar at z-50... 
          we use fixed inset-0 at z-[60] so it's above the navbar) */}
      <div className="fixed inset-0 z-[60] bg-base-100 flex flex-col overflow-hidden">

        {/* ── Top Bar ──────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-base-200 border-b border-base-300">
          {/* Left: title + progress */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-base-content truncate">
                {test.topicName}
              </h1>
              <p className="text-xs text-base-content/50">
                {answeredCount}/{totalQ} answered
              </p>
            </div>
          </div>

          {/* Center: Timer */}
          <div
            className={`flex items-center gap-2 bg-base-100 border border-base-300 rounded-xl px-4 py-2 shadow-sm font-mono font-bold text-lg ${timerColor}`}
          >
            <Clock3 size={17} />
            {timeLeft === null ? (
              <span className="opacity-40 text-base">--:--:--</span>
            ) : (
              <span>{formatTime(timeLeft)}</span>
            )}
          </div>

          {/* Right: Submit button */}
          <button
            onClick={onSubmitClick}
            className="btn btn-primary rounded-xl h-9 min-h-0 px-4 text-sm"
          >
            Submit Test
          </button>
        </div>

        {/* ── Body: Sidebar + Question Area ─────────────── */}
        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* Sidebar */}
          <div className="w-64 shrink-0 border-r border-base-300 flex flex-col bg-base-100 overflow-hidden">
            <div className="p-3 border-b border-base-300">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Questions
              </p>
            </div>

            {/* Question grid palette */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-4 gap-2">
                {test.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectQuestion(index)}
                    className={`aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                      selectedQuestion === index
                        ? "bg-primary text-primary-content shadow-sm"
                        : typeof savedMcqAnswers[index] === "number"
                        ? "bg-success/15 border border-success/40 text-success"
                        : "bg-base-200 border border-base-300 text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <div className="w-4 h-4 rounded bg-success/15 border border-success/40 shrink-0" />
                  Answered
                </div>
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <div className="w-4 h-4 rounded bg-base-200 border border-base-300 shrink-0" />
                  Not answered
                </div>
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <div className="w-4 h-4 rounded bg-primary shrink-0" />
                  Current
                </div>
              </div>
            </div>

            {/* Answered summary at bottom */}
            <div className="p-3 border-t border-base-300 bg-base-200/50">
              <p className="text-xs text-center text-base-content/60">
                <span className="font-bold text-base-content">{answeredCount}</span>
                {" "}/ {totalQ} questions answered
              </p>
            </div>
          </div>

          {/* Question Panel */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-base-100">
            {/* Question header */}
            <div className="shrink-0 px-6 py-4 border-b border-base-300 bg-base-200/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-base-content/50 font-medium">
                  Question {selectedQuestion + 1} of {totalQ}
                </span>
                {currentQuestion.marks && (
                  <span className="badge badge-outline rounded-lg text-xs font-semibold">
                    {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-base-content leading-snug">
                {currentQuestion.questionText || currentQuestion.questionName}
              </h2>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3 max-w-3xl">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectOption(index)}
                    className={`min-h-14 px-4 py-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all duration-150 ${
                      mcqAnswers[selectedQuestion] === index
                        ? "border-primary bg-primary/10"
                        : "border-base-300 bg-base-200 hover:border-primary/50 hover:bg-base-300/50"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg border grid place-items-center font-bold text-sm shrink-0 transition-all ${
                        mcqAnswers[selectedQuestion] === index
                          ? "bg-primary text-primary-content border-primary"
                          : "bg-base-100 border-base-300 text-base-content/70"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span
                      className={`font-medium ${
                        mcqAnswers[selectedQuestion] === index
                          ? "text-primary"
                          : "text-base-content"
                      }`}
                    >
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer: Save & Next */}
            <div className="shrink-0 px-6 py-4 border-t border-base-300 bg-base-200/50 flex items-center justify-between">
              <button
                onClick={() =>
                  onSelectQuestion(Math.max(0, selectedQuestion - 1))
                }
                disabled={selectedQuestion === 0}
                className="btn btn-outline border-base-300 rounded-xl h-10 min-h-0 px-4 text-sm disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={onSaveAndNext}
                disabled={savingAnswer}
                className="btn btn-primary rounded-xl h-10 min-h-0 px-5 gap-2 text-sm"
              >
                {savingAnswer ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <ArrowRight size={15} />
                )}
                {selectedQuestion === totalQ - 1 ? "Save & Review" : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lock Overlay ──────────────────────── */}
      {!showInstructions && !isFullscreen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-base-100 rounded-3xl p-8 max-w-md w-full border border-base-300 text-center shadow-2xl">
            <AlertTriangle className="mx-auto text-warning mb-4 animate-bounce" size={54} />
            <h3 className="text-2xl font-extrabold mb-2 tracking-tight">Fullscreen Required</h3>
            <p className="text-sm text-base-content/70 mb-6 leading-relaxed">
              To ensure the integrity of the test and keep distraction-free, this assessment must be taken in fullscreen mode.
            </p>
            <button
              onClick={() => {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                  elem.requestFullscreen().catch((err) => console.log(err));
                }
              }}
              className="btn btn-primary w-full h-12 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Maximize2 size={16} className="mr-2" />
              Enter Fullscreen & Resume
            </button>
          </div>
        </div>
      )}

      {/* ── Submit Confirm Dialog ───────────────────────── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancelSubmit}
          />
          <div className="relative w-full max-w-md bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} className="text-warning" />
              </div>
              <h2 className="text-lg font-bold">Submit Test</h2>
            </div>

            {/* Answered stats */}
            <div className="bg-base-200 border border-base-300 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-success">{answeredCount}</p>
                <p className="text-xs text-base-content/60 mt-0.5">Answered</p>
              </div>
              <div className="w-px h-10 bg-base-300" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-error">{totalQ - answeredCount}</p>
                <p className="text-xs text-base-content/60 mt-0.5">Unanswered</p>
              </div>
              <div className="w-px h-10 bg-base-300" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{totalQ}</p>
                <p className="text-xs text-base-content/60 mt-0.5">Total</p>
              </div>
            </div>

            <p className="text-base-content/70 text-sm leading-relaxed mb-5">
              You have attempted <strong>{answeredCount}/{totalQ}</strong> questions.
              {answeredCount < totalQ ? (
                <>
                  {" "}There are still <strong>{totalQ - answeredCount}</strong> unanswered questions.
                </>
              ) : (
                " All questions have been answered."
              )}
              <br />
              <span className="text-xs text-base-content/50 mt-2 block">
                Once submitted, you cannot change your answers.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancelSubmit}
                className="btn btn-outline border-base-300 rounded-xl"
              >
                Continue Test
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="btn btn-primary rounded-xl"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default McqTestView;
