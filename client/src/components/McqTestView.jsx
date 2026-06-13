import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Trophy,
} from "lucide-react";
import ConfirmBox from "./ConfirmBox";

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
  onSubmitClick,
  onCancelSubmit,
  onConfirmSubmit,
}) => {
  const currentQuestion = test.questions[selectedQuestion];
  const answeredCount = savedMcqAnswers.filter(
    (answer) => typeof answer === "number"
  ).length;

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-3xl overflow-hidden">
            <div className="bg-primary p-6 text-primary-content">
              <h2 className="text-3xl font-extrabold">
                {test.topicName}
              </h2>
              <p className="mt-2 opacity-90">
                {test.subject || "MCQ"} assessment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-base-200 rounded-xl p-5 flex items-center gap-4">
                <Trophy size={22} className="text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">
                    Full Marks
                  </p>
                  <h3 className="text-2xl font-bold">
                    {test.fullMarks}
                  </h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-xl p-5 flex items-center gap-4">
                <Clock3 size={22} className="text-secondary" />
                <div>
                  <p className="text-sm text-base-content/60">
                    Duration
                  </p>
                  <h3 className="text-2xl font-bold">
                    {test.duration} Minutes
                  </h3>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-base-200 rounded-xl p-4 max-h-72 overflow-y-auto">
                <ul className="space-y-3">
                  {test.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onStart}
                className="btn btn-primary w-full mt-6 h-12 rounded-xl text-base"
              >
                I Understand, Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100dvh-3.5rem)] overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4">
        <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 min-h-0 bg-base-100 border border-base-300 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-base-300">
              <h1 className="text-xl font-extrabold">
                {test.topicName}
              </h1>
              <p className="text-xs text-base-content/60 mt-1">
                {answeredCount}/{test.questions.length} answered
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {test.questions.map((question, index) => (
                <button
                  key={question.questionNumber || index}
                  onClick={() => onSelectQuestion(index)}
                  className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between ${
                    selectedQuestion === index
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 hover:bg-base-300"
                  }`}
                >
                  <span>Question {index + 1}</span>
                  {typeof savedMcqAnswers[index] === "number" && (
                    <CheckCircle2 size={16} />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-base-300">
              <button
                onClick={onSubmitClick}
                className="btn btn-primary w-full"
              >
                Submit Test
              </button>
            </div>
          </div>

          <div className="lg:col-span-9 min-h-0 bg-base-100 border border-base-300 rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-base-300 bg-base-200/40">
              <p className="text-xs text-base-content/60">
                Question {selectedQuestion + 1} of {test.questions.length}
              </p>
              <h2 className="text-xl font-bold mt-1">
                {currentQuestion.questionText ||
                  currentQuestion.questionName}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectOption(index)}
                    className={`min-h-14 px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition ${
                      mcqAnswers[selectedQuestion] === index
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-base-300 bg-base-200 hover:border-primary"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-base-100 border border-base-300 grid place-items-center font-bold shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-base-300 bg-base-200/50 flex justify-end">
              <button
                onClick={onSaveAndNext}
                disabled={savingAnswer}
                className="btn btn-primary rounded-xl gap-2"
              >
                {savingAnswer ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {selectedQuestion === test.questions.length - 1
                  ? "Save and Submit"
                  : "Save and Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmBox
        isOpen={showSubmitConfirm}
        title="Submit Test"
        message="Are you sure you want to submit the test?"
        confirmText="Yes, Submit"
        cancelText="Cancel"
        onCancel={onCancelSubmit}
        onConfirm={onConfirmSubmit}
      />
    </>
  );
};

export default McqTestView;
