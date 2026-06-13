import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckSquare, Square, RefreshCw, ClipboardList, User, BookOpen, ListChecks } from "lucide-react";

import axiosInstance from "../lib/axios";
import SubmissionEvaluationCard from "../components/SubmissionEvaluationCard";
import McqSubmissionEvaluationCard from "../components/McqSubmissionEvaluationCard";

const ADMIN_KEY = "mysecretadminkey";

const SubmissionEvaluation = () => {
  const { submissionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [username, setUsername] = useState("");
  const [testType, setTestType] = useState("coding");
  const [questions, setQuestions] = useState([]);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Fetch Submission ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axiosInstance.get(`/submissions/${submissionId}`, {
          headers: { "x-admin-key": ADMIN_KEY },
        });

        const submission = res.data;
        setTopicName(submission.test?.topicName || "Unknown Test");
        setUsername(submission.user?.username || "Unknown User");
        setTestType(submission.test?.testType || "coding");
        setQuestions(submission.questions || []);
        setEvaluated(submission.isEvaluated || false);
      } catch (error) {
        console.error("Fetch submission error:", error);
        showToast("error", "Failed to load submission.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  // ─── Handle local question field change ──────────────────────────────────
  const handleChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        return {
          ...q,
          [field]:
            field === "isSolved"
              ? value
              : field === "remarks" || field === "correctOption"
              ? value
              : value === ""
              ? ""
              : Number(value),
        };
      })
    );
  };

  // ─── Save all evaluations + status ───────────────────────────────────────
  const handleUpdateAll = async () => {
    try {
      setSubmitting(true);

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];

        const payload =
          question.questionType === "mcq"
            ? { correctOption: question.correctOption }
            : {
                codingMarks: question.codingMarks || 0,
                timeComplexityMarks: question.timeComplexityMarks || 0,
                spaceComplexityMarks: question.spaceComplexityMarks || 0,
                remarks: question.remarks || "",
                isSolved: question.isSolved,
              };

        await axiosInstance.patch(
          `/submissions/evaluate/${submissionId}/${index}`,
          payload,
          { headers: { "x-admin-key": ADMIN_KEY } }
        );
      }

      // Mark evaluation status
      await axiosInstance.patch(
        `/submissions/${submissionId}/status`,
        { isEvaluated: evaluated },
        { headers: { "x-admin-key": ADMIN_KEY } }
      );

      showToast("success", "Submission updated successfully!");
    } catch (error) {
      console.error("Update all error:", error);
      showToast("error", error.response?.data?.message || "Failed to update submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (question) => {
    if (question.questionLink) window.open(question.questionLink, "_blank");
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 font-medium">Loading submission…</p>
      </div>
    );
  }

  const isMcq = testType === "mcq";
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const totalScore = questions.reduce(
    (sum, q) =>
      sum +
      (q.mcqMarks || 0) +
      (q.codingMarks || 0) +
      (q.timeComplexityMarks || 0) +
      (q.spaceComplexityMarks || 0),
    0
  );

  return (
    <div className="min-h-screen bg-base-100 p-6">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`toast toast-top toast-end z-50`}>
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg`}>
            <span className="font-semibold">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className={`badge badge-lg font-bold uppercase text-xs tracking-wider ${isMcq ? "badge-secondary" : "badge-primary"}`}>
            {isMcq ? "MCQ Test" : "Coding Test"}
          </div>
          {evaluated && (
            <div className="badge badge-success badge-lg font-bold text-xs uppercase tracking-wider">
              ✓ Evaluated
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-base-content mt-2">
          Submission Evaluation
        </h1>
        <p className="text-base-content/60 mt-1 text-sm">
          {isMcq
            ? "Review MCQ answers, verify correct options, and save evaluation."
            : "Review coding solutions and assign marks to each question."}
        </p>
      </div>

      {/* ── Submission Info Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* User */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User size={22} />
          </div>
          <div>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">Student</p>
            <p className="text-lg font-bold">{username}</p>
          </div>
        </div>

        {/* Test Topic */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">Topic</p>
            <p className="text-lg font-bold">{topicName}</p>
          </div>
        </div>

        {/* Questions count */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <ListChecks size={22} />
          </div>
          <div>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">Questions</p>
            <p className="text-lg font-bold">
              {isMcq
                ? `${correctCount} / ${questions.length} Correct`
                : `${questions.length} Questions`}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">Total Score</p>
            <p className="text-lg font-bold">{totalScore} pts</p>
          </div>
        </div>
      </div>

      {/* ── Section Title ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-base-content/80">
          {isMcq ? "MCQ Questions" : "Coding Questions"}
        </h2>
        <p className="text-sm text-base-content/50">
          {isMcq
            ? "Click any option circle to override the correct answer if the AI made a mistake."
            : "Set marks and remarks for each coding question."}
        </p>
      </div>

      {/* ── Question Cards ─────────────────────────────────────────────────── */}
      <div className="space-y-5 mb-8">
        {questions.map((question, index) => {
          if (question.questionType === "mcq") {
            return (
              <McqSubmissionEvaluationCard
                key={index}
                questionNumber={index + 1}
                questionName={question.questionName}
                options={question.options}
                selectedOption={question.selectedOption}
                correctOption={question.correctOption}
                mcqMarks={question.mcqMarks}
                onChange={(value) => handleChange(index, "correctOption", value)}
              />
            );
          }

          return (
            <SubmissionEvaluationCard
              key={index}
              questionNumber={index + 1}
              questionName={question.questionName}
              codingMarks={question.codingMarks}
              timeComplexityMarks={question.timeComplexityMarks}
              spaceComplexityMarks={question.spaceComplexityMarks}
              remarks={question.remarks}
              isSolved={question.isSolved || false}
              onChange={(field, value) => handleChange(index, field, value)}
              onView={() => handleView(question)}
            />
          );
        })}
      </div>

      {/* ── Bottom Action Bar ─────────────────────────────────────────────── */}
      <div className="sticky bottom-4 z-40">
        <div className="bg-base-100/90 backdrop-blur-lg border border-base-300 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Evaluated Toggle */}
          <label className="flex items-center gap-4 cursor-pointer select-none">
            <div
              onClick={() => setEvaluated((prev) => !prev)}
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                evaluated
                  ? "bg-success border-success text-white"
                  : "border-base-300 bg-base-200 text-base-content/30"
              }`}
            >
              {evaluated ? <CheckSquare size={22} /> : <Square size={22} />}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {evaluated ? "Marked as Evaluated" : "Mark as Evaluated"}
              </h3>
              <p className="text-xs text-base-content/50">
                Status is saved when you click Update
              </p>
            </div>
          </label>

          {/* Update Button */}
          <button
            onClick={handleUpdateAll}
            disabled={submitting}
            className="btn btn-primary rounded-2xl h-14 px-10 text-base gap-2 min-w-[200px]"
          >
            {submitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckSquare size={18} />
                Save All Evaluations
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionEvaluation;