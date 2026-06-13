import React, { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import ConfirmBox from "./ConfirmBox";


import {
  ExternalLink,
  Trophy,
  Code2,
  Database,
  TerminalSquare,
  BarChart3,
  ArrowRight,
  MessageSquareText, // ✅ FIXED IMPORT
} from "lucide-react";

const QuestionCard = ({
  testId,
  questionIndex,
  submissionId,

  questionNumber,
  title,
  marks,
  questionLink,

  timeComplexity,
  spaceComplexity,

  onTimeComplexityChange,
  onSpaceComplexityChange,

  isEvaluated,
  codingMarks,
  timeComplexityMarks,
  spaceComplexityMarks,
  remarks,

  onEvaluationComplete,
}) => {
  const [solution, setSolution] = useState("");
  // const [timeComplexity, setTimeComplexity] = useState("");
  // const [spaceComplexity, setSpaceComplexity] = useState("");

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [isEvaluated, setIsEvaluated] = useState(false);

  useEffect(() => {
    setSolution("");
  }, [questionIndex]);

const handleOpenQuestion = () => {
  if (!questionLink) return;

  const url =
    questionLink.startsWith("http")
      ? questionLink
      : `https://${questionLink}`;

  window.open(url, "_blank", "noopener,noreferrer");
};

 const handleSubmit = async () => {
  if (!solution.trim()) {
    return alert("Please enter your solution");
  }

  if (!timeComplexity.trim()) {
    return alert(
      "Please enter Time Complexity"
    );
  }

  if (!spaceComplexity.trim()) {
    return alert(
      "Please enter Space Complexity"
    );
  }
  try {
    setIsEvaluating(true);

    const res =
      await axiosInstance.post(
  `/submissions/evaluate-question/${submissionId}/${testId}/${questionIndex}`,
  {
    solution,
    timeComplexity,
    spaceComplexity,
    marks,
  }
);

    const evaluatedQuestion =
      res.data.question;

onEvaluationComplete(
  questionIndex,
  evaluatedQuestion
);

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Evaluation failed"
    );

  } finally {

    setIsEvaluating(false);

  }
};

  return (
    <div className="h-full flex flex-col bg-base-100 border border-base-300 rounded-2xl shadow-lg overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-base-300 bg-base-200/40">
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">
            <p className="text-xs text-base-content/60">
              Question {questionNumber}
            </p>

            <h1 className="text-xl font-bold leading-snug mt-1 truncate">
              {title}
            </h1>
          </div>

          <button
            onClick={handleOpenQuestion}
            className="btn btn-primary rounded-xl gap-2 whitespace-nowrap"
          >
            Solve
            <ExternalLink size={14} />
          </button>

        </div>
      </div>

      {/* STATS BAR */}
      <div className="px-6 py-3 border-b border-base-300 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-xl text-sm min-w-[140px]">
          <Trophy size={16} className="text-primary" />
          <span className="text-base-content/70">Coding</span>
          <span className="font-bold ml-auto">{marks - 10}</span>
        </div>

        <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-xl text-sm min-w-[140px]">
          <Code2 size={16} className="text-secondary" />
          <span className="text-base-content/70">Time</span>
          <span className="font-bold ml-auto">6</span>
        </div>

        <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-xl text-sm min-w-[140px]">
          <Database size={16} className="text-accent" />
          <span className="text-base-content/70">Space</span>
          <span className="font-bold ml-auto">4</span>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-2 rounded-xl text-sm min-w-[140px] ml-auto border border-base-300">
          <BarChart3 size={16} className="text-primary" />
          <span className="text-base-content/70">Total</span>
          <span className="font-bold ml-auto">{marks}</span>
        </div>

      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col p-6 gap-4 min-h-0">

        {/* LOADING */}
        {isEvaluating && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="loading loading-spinner loading-lg text-primary"></div>

            <p className="text-sm text-base-content/70 animate-pulse">
              AI is evaluating your solution...
            </p>

            <p className="text-xs text-base-content/50">
              Checking code quality, time & space complexity
            </p>
          </div>
        )}

        {/* EDITOR VIEW */}
        {!isEvaluating && !isEvaluated && (
          <>
            <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              <TerminalSquare size={16} className="text-primary" />
              <span>Your Solution</span>
            </div>

            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="// Paste your solution here..."
              className="flex-1 w-full resize-none font-mono text-sm p-4 rounded-xl bg-base-200 border border-base-300 outline-none focus:border-primary"
            />

            <div className="flex items-end gap-3 w-full">

              <div className="flex gap-3 flex-1">

                <div className="flex-1 min-w-[180px]">
                  <div className="mb-1 text-sm font-semibold text-primary flex items-center gap-1 p-1">
                    <Code2 size={15} />
                    <span>Time Complexity</span>
                  </div>

                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) =>
                      onTimeComplexityChange(e.target.value)
                    }
                    placeholder="O(n log n)"
                    className="input input-bordered input-sm w-full"
                  />
                </div>

                <div className="flex-1 min-w-[180px]">
                  <div className="mb-1 text-sm font-semibold text-secondary flex items-center gap-1 p-1">
                    <Database size={15} />
                    <span>Space Complexity</span>
                  </div>

                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) =>
                      onSpaceComplexityChange(e.target.value)
                    }
                    placeholder="O(n)"
                    className="input input-bordered input-sm w-full"
                  />
                </div>

              </div>

              <button
  onClick={() => setShowConfirm(true)}
  className="btn btn-primary ml-16 px-6 rounded-xl whitespace-nowrap h-[38px] flex items-center gap-2"
>
  Evaluate
  <ArrowRight size={16} />
</button>

            </div>
          </>
        )}

        {/* RESULT VIEW */}
        {isEvaluated && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">

              <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 size={18} />
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Coding Marks</p>
                  <h3 className="font-bold text-base">
                    {codingMarks}
                  </h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <TerminalSquare size={18} />
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Time Complexity</p>
                  <h3 className="font-bold text-base">
                    {timeComplexityMarks}
                  </h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Database size={18} />
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Space Complexity</p>
                  <h3 className="font-bold text-base">
                    {spaceComplexityMarks}
                  </h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <Trophy size={18} />
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Total Marks</p>
                  <h3 className="font-bold text-base">
                    {codingMarks +
                      timeComplexityMarks +
                      spaceComplexityMarks}
                  </h3>
                </div>
              </div>

            </div>

            <div className="bg-base-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                <MessageSquareText size={18} />
              </div>

              <div>
                <p className="text-xs text-base-content/60 mb-1">Remarks</p>
                <h3 className="font-medium text-sm text-base-content leading-relaxed">
                  {remarks}
                </h3>
              </div>
            </div>
          </>
        )}

      </div>
      <ConfirmBox
  isOpen={showConfirm}
  title="Confirm Evaluation"
  message="Are you sure you want to Evaluate?"
  confirmText="Yes, Evaluate"
  cancelText="Cancel"
  onCancel={() => setShowConfirm(false)}
  onConfirm={() => {
    setShowConfirm(false);
    handleSubmit();
  }}
/>
    </div>
  );
};

export default QuestionCard;
