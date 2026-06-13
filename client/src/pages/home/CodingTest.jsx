
import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import QuestionCard from "../../components/QuestionCard";
import ConfirmBox from "../../components/ConfirmBox";
import McqTestView from "../../components/McqTestView";

import { Clock3, Trophy, BookOpen, Tags } from "lucide-react";

import axiosInstance from "../../lib/axios";

const CodingTest = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [submissionId, setSubmissionId] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(null);
  // const timerRef = React.useRef(null);
  const submissionIdRef = React.useRef(null);

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const [complexityAnswers, setComplexityAnswers] = useState([]);
  const [questionResults, setQuestionResults] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState([]);
  const [savedMcqAnswers, setSavedMcqAnswers] = useState([]);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [endTime, setEndTime] = useState(null);
  // const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
  submissionIdRef.current = submissionId;
}, [submissionId]);

// const startTimer = (startTime) => {
//   if (!test) return; // safety guard

//   if (timerRef.current) clearInterval(timerRef.current);

//   const durationMs = test.duration * 60 * 60 * 1000;
//   const endTime = startTime + durationMs;

//   const update = () => {
//     const diff = endTime - Date.now();

//     if (diff <= 0) {
//       clearInterval(timerRef.current);
//       setTimeLeft(0);

//       localStorage.removeItem(`test_start_${testId}`);

//       handleSubmit();
//       return;
//     }

//     setTimeLeft(diff);
//   };

//   update();
//   timerRef.current = setInterval(update, 1000);
// };

// const formatTime = (ms) => {
//   const totalSeconds = Math.floor(ms / 1000);
//   const hrs = Math.floor(totalSeconds / 3600);
//   const mins = Math.floor((totalSeconds % 3600) / 60);
//   const secs = totalSeconds % 60;

//   return `${hrs.toString().padStart(2, "0")}:${mins
//     .toString()
//     .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// };

  const fetchTest = async () => {
    try {
      // Fetch test details
      const testRes = await axiosInstance.get(
        `/test/${testId}`
      );

      setTest(testRes.data);

      setComplexityAnswers(
        testRes.data.questions.map(() => ({
          timeComplexity: "",
          spaceComplexity: "",
        }))
      );

      setQuestionResults(
  testRes.data.questions.map(() => ({
    isEvaluated: false,
    codingMarks: 0,
    timeComplexityMarks: 0,
    spaceComplexityMarks: 0,
    remarks: "",
  }))
);

      const emptyMcqAnswers = testRes.data.questions.map(() => null);
      setMcqAnswers(emptyMcqAnswers);
      setSavedMcqAnswers(emptyMcqAnswers);

      // Check if submission already exists
      try {
        const submissionRes =
          await axiosInstance.get(
            `/submissions/test/${testId}`
          );

        if (submissionRes.data) {

  const submission =
    submissionRes.data;

  setSubmissionId(
    submission._id
  );

  setEndTime(submission.endTime);

  setShowInstructions(false);

  // Restore user's TC/SC
  setComplexityAnswers(
    submission.questions.map((q) => ({
      timeComplexity:
        q.submittedTimeComplexity || "",

      spaceComplexity:
        q.submittedSpaceComplexity || "",
    }))
  );

  // Restore evaluation results
  setQuestionResults(
    submission.questions.map((q) => ({
      isEvaluated:
        q.isEvaluated || false,

      codingMarks:
        q.codingMarks || 0,

      timeComplexityMarks:
        q.timeComplexityMarks || 0,

      spaceComplexityMarks:
        q.spaceComplexityMarks || 0,

      remarks:
        q.remarks || "",
    }))
  );

  const restoredMcqAnswers = submission.questions.map((q) =>
      typeof q.selectedOption === "number"
        ? q.selectedOption
        : null
  );

  setMcqAnswers(restoredMcqAnswers);
  setSavedMcqAnswers(restoredMcqAnswers);
}
      } catch {
        // No submission found
        setShowInstructions(true);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const startTest = async () => {
  try {
    const res = await axiosInstance.post("/submissions/create", {
      testId,
    });

    setSubmissionId(res.data._id);
    setEndTime(res.data.endTime);
    const restoredMcqAnswers =
      res.data.questions?.map((q) =>
        typeof q.selectedOption === "number"
          ? q.selectedOption
          : null
      ) || [];

    setMcqAnswers(restoredMcqAnswers);
    setSavedMcqAnswers(restoredMcqAnswers);
    setShowInstructions(false);

    // const startTime = Date.now();

    // localStorage.setItem(`test_start_${testId}`, startTime.toString());

    // setTimerStarted(true);
    // startTimer(startTime);
  } catch (error) {
    console.log(error);

    if (error.response?.data?.message === "Submission already exists") {
      setShowInstructions(false);

      // const savedStart = localStorage.getItem(`test_start_${testId}`);

      // if (savedStart && !timerStarted) {
      //   setTimerStarted(true);
      //   startTimer(Number(savedStart));
      // }
    }
  }
};

// useEffect(() => {
//   if (!test) return; // wait until test is loaded

//   const savedStart = localStorage.getItem(`test_start_${testId}`);

//   if (savedStart && !timerStarted) {
//     setShowInstructions(false);
//     startTimer(Number(savedStart));
//     setTimerStarted(true);
//   }
// }, [test, testId]);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const handleComplexityChange = (
    questionIndex,
    field,
    value
  ) => {
    setComplexityAnswers((prev) => {
      const updated = [...prev];

      updated[questionIndex] = {
        ...updated[questionIndex],
        [field]: value,
      };

      return updated;
    });
  };

const handleSubmit = async () => {
  try {
    const id = submissionIdRef.current;

    if (!id) {
      console.error("No submissionId found");
      return;
    }

    await axiosInstance.patch(
      `/submissions/${id}/finish`
    );

    if (test?.testType === "mcq") {
      navigate(`/insights/${id}`);
    } else {
      navigate("/attempted-tests");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleMcqOptionChange = async (optionIndex) => {
  if (!submissionId) {
    return alert("Please start the test first");
  }

  setMcqAnswers((prev) => {
    const updated = [...prev];
    updated[selectedQuestion] = optionIndex;
    return updated;
  });

  try {
    setSavingAnswer(true);
    await axiosInstance.patch(
      `/submissions/${submissionId}/mcq/${selectedQuestion}`,
      { selectedOption: optionIndex }
    );
    setSavedMcqAnswers((prev) => {
      const updated = [...prev];
      updated[selectedQuestion] = optionIndex;
      return updated;
    });
  } catch (error) {
    console.error("Failed to save MCQ answer:", error);
    alert(
      error.response?.data?.message ||
        "Failed to save answer"
    );
  } finally {
    setSavingAnswer(false);
  }
};

const handleMcqSaveAndNext = () => {
  if (selectedQuestion < test.questions.length - 1) {
    setSelectedQuestion((prev) => prev + 1);
  } else {
    setShowSubmitConfirm(true);
  }
};

// useEffect(() => {
//   return () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
//   };
// }, []);

  if (loading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!test) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex items-center justify-center text-2xl font-bold">
        Test Not Found
      </div>
    );
  }

  if (test.testType === "mcq") {
    return (
      <McqTestView
        test={test}
        testId={testId}
        endTime={endTime}
        selectedQuestion={selectedQuestion}
        mcqAnswers={mcqAnswers}
        savedMcqAnswers={savedMcqAnswers}
        savingAnswer={savingAnswer}
        showInstructions={showInstructions}
        showSubmitConfirm={showSubmitConfirm}
        onStart={startTest}
        onSelectQuestion={setSelectedQuestion}
        onSelectOption={handleMcqOptionChange}
        onSaveAndNext={handleMcqSaveAndNext}
        onSubmitClick={() => setShowSubmitConfirm(true)}
        onCancelSubmit={() => setShowSubmitConfirm(false)}
        onConfirmSubmit={() => {
          setShowSubmitConfirm(false);
          handleSubmit();
        }}
      />
    );
  }
  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-3xl shadow-2xl border border-base-300 w-full max-w-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
              <h2 className="text-3xl font-extrabold">
                {test.topicName}
              </h2>

              <p className="mt-2 opacity-90">
                Read all instructions carefully before
                starting.
              </p>

              {test.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Tags size={15} />

                  {test.topics.map((topic) => (
                    <span
                      key={topic._id || topic.name}
                      className="badge badge-outline border-primary-content/50 text-primary-content rounded-md px-2 py-2 text-[11px] font-medium"
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-base-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy size={22} />
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Full Marks
                  </p>

                  <h3 className="text-2xl font-bold">
                    {test.fullMarks}
                  </h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Clock3 size={22} />
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Duration
                  </p>

                  <h3 className="text-2xl font-bold">
                    {test.duration} Hours
                  </h3>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} />
                <h3 className="text-xl font-bold">
                  Instructions
                </h3>
              </div>

              <div className="bg-base-200 rounded-2xl p-4 max-h-72 overflow-y-auto">
                <ul className="space-y-3">
                  {test.instructions.map(
                    (instruction, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{instruction}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <button
                onClick={startTest}
                className="btn btn-primary w-full mt-6 h-12 rounded-xl text-base"
              >
                I Understand, Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100dvh-3.5rem)] overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4">
        <div className="h-full min-h-0 flex flex-col">
          <div className="shrink-0 mb-4 flex items-start justify-between gap-4">
  
  {/* Left: Title */}
  <div>
    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {test.topicName}
    </h1>

    <p className="text-base-content/70 mt-1">
      Solve all questions carefully 🚀
    </p>
  </div>

  {/* Right: Timer */}
  {/* {timeLeft !== null && (
    <div className="flex items-center gap-2 bg-base-100 border border-base-300 px-4 py-2 rounded-xl shadow-sm shrink-0">
      <Clock3 className="text-primary" size={18} />
      <span className="font-mono font-bold text-lg">
        {formatTime(timeLeft)}
      </span>
    </div>
  )} */}

</div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 h-full min-h-0">
              <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm h-full min-h-0 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-base-300 shrink-0">
                  <h3 className="font-bold">
                    Questions
                  </h3>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
                  {test.questions.map(
                    (question, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedQuestion(index)
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedQuestion === index
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 hover:bg-base-300"
                          }`}
                      >
                        Question {index + 1}
                      </button>
                    )
                  )}
                </div>

                <div className="p-4 border-t border-base-300 shrink-0">
                  <button
  onClick={() => setShowSubmitConfirm(true)}
  className="btn btn-primary w-full"
>
  Submit Test
</button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 h-full min-h-0 overflow-hidden">
              <QuestionCard
                testId={testId}
                questionIndex={selectedQuestion}
                submissionId={submissionId}
                setSubmissionId={setSubmissionId}
                questionNumber={
                  selectedQuestion + 1
                }
                title={
                  test.questions[selectedQuestion]
                    .questionName
                }
                marks={
                  test.questions[selectedQuestion]
                    .marks
                }
                questionLink={
                  test.questions[selectedQuestion]
                    .questionLink
                }
                timeComplexity={
                  complexityAnswers[
                    selectedQuestion
                  ]?.timeComplexity || ""
                }
                spaceComplexity={
                  complexityAnswers[
                    selectedQuestion
                  ]?.spaceComplexity || ""
                }
                onTimeComplexityChange={(
                  value
                ) =>
                  handleComplexityChange(
                    selectedQuestion,
                    "timeComplexity",
                    value
                  )
                }
                onSpaceComplexityChange={(
                  value
                ) =>
                  handleComplexityChange(
                    selectedQuestion,
                    "spaceComplexity",
                    value
                  )
                }
                isEvaluated={
  questionResults[selectedQuestion]
    ?.isEvaluated || false
}

codingMarks={
  questionResults[selectedQuestion]
    ?.codingMarks || 0
}

timeComplexityMarks={
  questionResults[selectedQuestion]
    ?.timeComplexityMarks || 0
}

spaceComplexityMarks={
  questionResults[selectedQuestion]
    ?.spaceComplexityMarks || 0
}

remarks={
  questionResults[selectedQuestion]
    ?.remarks || ""
}

onEvaluationComplete={(
  questionIndex,
  result
) => {
  setQuestionResults(prev => {
    const updated = [...prev];

    updated[questionIndex] =
      result;

    return updated;
  });
}}

              />
            </div>
          </div>
        </div>
        <ConfirmBox
  isOpen={showSubmitConfirm}
  title="Submit Test"
  message="Are you sure you want to submit the test?"
  confirmText="Yes, Submit"
  cancelText="Cancel"
  onCancel={() => setShowSubmitConfirm(false)}
  onConfirm={() => {
    setShowSubmitConfirm(false);
    handleSubmit();
  }}
/>
      </div>
    </>
  );
};

export default CodingTest;


