import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Check,
  HelpCircle,
  Brain,
} from "lucide-react";

const McqSubmissionEvaluationCard = ({
  questionNumber,
  questionName,
  options = [],
  selectedOption,
  correctOption,
  mcqMarks,
  onChange,
}) => {
  const isStudentCorrect =
    selectedOption !== null && selectedOption === correctOption;

  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300">

      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-base-200">

        {/* Left: Number + Type */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold shrink-0">
            {questionNumber}
          </div>
          <div>
            <span className="badge badge-secondary badge-sm text-[10px] uppercase font-extrabold tracking-wider mb-1">
              MCQ Question
            </span>
            <div className="flex items-center gap-1.5 text-xs text-base-content/50 font-medium">
              <Brain size={12} />
              <span>Click any option circle to override correct answer</span>
            </div>
          </div>
        </div>

        {/* Right: Score + Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold">
            <Award size={13} className="text-secondary" />
            <span>{mcqMarks} pts</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              selectedOption === null || selectedOption === undefined
                ? "bg-neutral/10 border border-neutral/20 text-base-content/60"
                : isStudentCorrect
                ? "bg-success/10 border border-success/20 text-success"
                : "bg-error/10 border border-error/20 text-error"
            }`}
          >
            {selectedOption === null || selectedOption === undefined ? (
              <>
                <HelpCircle size={13} />
                <span>Not Answered</span>
              </>
            ) : isStudentCorrect ? (
              <>
                <CheckCircle2 size={13} />
                <span>Correct</span>
              </>
            ) : (
              <>
                <AlertCircle size={13} />
                <span>Incorrect</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Question Text ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-base-content leading-relaxed">
          {questionName}
        </h2>
      </div>

      {/* ── Options Grid ──────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest mb-3">
          Options — click the circle to set as correct answer
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, index) => {
            const isCorrect = index === correctOption;
            const isSelected = index === selectedOption;
            const isWrongAnswer = isSelected && !isCorrect;

            let cardStyle = "border-base-300 bg-base-100 hover:border-secondary/60";
            if (isCorrect && isSelected) {
              cardStyle = "border-success bg-success/8 ring-2 ring-success/20";
            } else if (isCorrect) {
              cardStyle = "border-success bg-success/5";
            } else if (isWrongAnswer) {
              cardStyle = "border-error/50 bg-error/5";
            }

            return (
              <div
                key={index}
                onClick={() => onChange(index)}
                className={`min-h-16 px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio-style indicator */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isCorrect
                        ? "bg-success border-success text-white"
                        : "border-base-300 bg-base-200 hover:border-secondary"
                    }`}
                  >
                    {isCorrect ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <span className="text-[11px] font-black opacity-70">
                        {letterLabels[index]}
                      </span>
                    )}
                  </div>

                  {/* Option text */}
                  <span
                    className={`font-semibold text-sm leading-snug ${
                      isCorrect
                        ? "text-success-content"
                        : isWrongAnswer
                        ? "text-error"
                        : "text-base-content"
                    }`}
                  >
                    {option}
                  </span>
                </div>

                {/* Answer indicators */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {isCorrect && (
                    <span className="badge badge-success badge-sm font-bold text-[9px] uppercase px-1.5">
                      ✓ Correct
                    </span>
                  )}
                  {isSelected && (
                    <span
                      className={`badge badge-sm font-bold text-[9px] uppercase px-1.5 ${
                        isCorrect ? "badge-success" : "badge-error"
                      }`}
                    >
                      Student
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default McqSubmissionEvaluationCard;
