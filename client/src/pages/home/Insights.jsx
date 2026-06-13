import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import InsightsCard from "../../components/InsightsCard";

import axiosInstance from "../../lib/axios";

import {
  Trophy,
  Percent,
  Sparkles,
  BookOpen,
  Tags,
  X,
} from "lucide-react";

const LeaderboardModal = ({
  isOpen,
  onClose,
  loading,
  error,
  leaderboard,
  fullMarks,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-base-300">
          <div>
            <h2 className="text-2xl font-extrabold text-base-content flex items-center gap-2">
              <Trophy size={22} className="text-primary" />
              Leaderboard
            </h2>
            <p className="text-sm text-base-content/60 mt-1">
              Only evaluated submissions for this test
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close leaderboard"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="min-h-[220px] flex items-center justify-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-error font-semibold">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-bold text-base-content">
                No evaluated submissions yet
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Once submissions are evaluated, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;

                let rankStyle =
                  "bg-base-200 text-base-content";

                if (rank === 1) {
                  rankStyle = "bg-amber-400/15 text-amber-600";
                } else if (rank === 2) {
                  rankStyle = "bg-slate-300/20 text-slate-600";
                } else if (rank === 3) {
                  rankStyle = "bg-orange-400/15 text-orange-600";
                }

                return (
                  <div
                    key={entry.submissionId}
                    className="bg-base-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-3xl shrink-0 ${rankStyle}`}
>
  {rank === 1
    ? "🥇"
    : rank === 2
    ? "🥈"
    : rank === 3
    ? "🥉"
    : rank}
</div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base-content truncate">
                          {entry.actualName}
                        </h3>
                        <p className="text-xs text-base-content/60 truncate">
                          {entry.username}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-base-content">
                        {entry.score}/{fullMarks}
                      </p>
                      <p className="text-xs text-base-content/60">
                        Score
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Insights = () => {
  const { submissionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [leaderboardFetched, setLeaderboardFetched] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch Submission
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axiosInstance.get(
          `/submissions/${submissionId}`
        );

        setSubmission(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleLeaderboardOpen = async () => {
    setShowLeaderboard(true);

    if (leaderboardFetched) return;
    if (!submission?.test?._id) return;

    try {
      setLeaderboardLoading(true);
      setLeaderboardError("");

      const res = await axiosInstance.get("/submissions/all");

      const currentTestId = String(submission.test._id);

      const evaluatedSubmissions = (Array.isArray(res.data) ? res.data : [])
        .filter((item) => {
          const itemTestId = String(item.test?._id || item.test);
          const isEvaluated =
            item.isEvaluated || item.status === "evaluated" || item.isFinished;

          return itemTestId === currentTestId && isEvaluated;
        })
        .map((item) => {
          const score = (item.questions || []).reduce(
            (total, question) =>
              total +
              (question.mcqMarks || 0) +
              (question.codingMarks || 0) +
              (question.timeComplexityMarks || 0) +
              (question.spaceComplexityMarks || 0),
            0
          );

          return {
            submissionId: item._id,
            actualName: item.user?.name || "Unknown User",
            username: item.user?.username || "unknown",
            score,
            createdAt: item.createdAt,
          };
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

      setLeaderboard(evaluatedSubmissions);
      setLeaderboardFetched(true);
    } catch (error) {
      console.log(error);
      setLeaderboardError("Unable to load leaderboard right now.");
    } finally {
      setLeaderboardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Submission Not Found
      </div>
    );
  }

  const topicName = submission.test?.topicName || "Insights";
  const topics =
    submission.test?.testType === "mcq"
      ? (submission.test?.subject ? [{ name: submission.test.subject }] : [])
      : (submission.test?.topics || submission.test?.topicFolderIds || []);
  const insights = submission.questions || [];
  const fullMarks = submission.test?.fullMarks || 0;
  const mcqMarksPerQuestion =
    submission.test?.testType === "mcq" && insights.length
      ? fullMarks / insights.length
      : 1;

  // Total Score
  const score = insights.reduce((total, question) => {
    return (
      total +
      (question.mcqMarks || 0) +
      (question.codingMarks || 0) +
      (question.timeComplexityMarks || 0) +
      (question.spaceComplexityMarks || 0)
    );
  }, 0);

  // Percentage
  const percentage = fullMarks
    ? Math.floor((score / fullMarks) * 100)
    : 0;

  // Performance
  let performance;
  let performanceColor;

  if (percentage < 30) {
    performance = "Needs Improvement";
    performanceColor = "text-error";
  } else if (percentage < 50) {
    performance = "Below Average";
    performanceColor = "text-orange-500";
  } else if (percentage < 70) {
    performance = "Average";
    performanceColor = "text-warning";
  } else if (percentage < 90) {
    performance = "Good";
    performanceColor = "text-info";
  } else {
    performance = "Excellent";
    performanceColor = "text-success";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4 sm:p-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Insights
        </h1>

        <p className="text-base-content/70 mt-2 text-sm sm:text-base">
          Detailed analysis of your coding performance 📊
        </p>
      </div>

      {/* Top Statistics */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm mb-6">
        {/* Topic */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              {topicName}
            </h2>

            <p className="text-base-content/60 mt-1 text-sm">
              Performance Overview
            </p>

            {topics.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Tags size={14} className="text-primary" />

                {topics.map((topic) => (
                  <span
                    key={topic._id || topic.name}
                    className="badge badge-outline rounded-md px-2 py-2 text-[11px] font-medium"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {submission.test?.sourceType !== "ai" && (
            <button
              className="btn btn-primary btn-sm rounded-xl shadow-sm"
              onClick={handleLeaderboardOpen}
            >
              🏆 View Leaderboard
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Score */}
          <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Trophy size={18} />
            </div>

            <div>
              <p className="text-xs text-base-content/60">Score</p>
              <h3 className="font-bold text-base">
                {score}/{fullMarks}
              </h3>
            </div>
          </div>

          {/* Percentage */}
          <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <Percent size={18} />
            </div>

            <div>
              <p className="text-xs text-base-content/60">Percentage</p>
              <h3 className="font-bold text-base">{percentage}%</h3>
            </div>
          </div>

          {/* Questions Solved */}
          <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <BookOpen size={18} />
            </div>

            <div>
              <p className="text-xs text-base-content/60">Solved</p>
              <h3 className="font-bold text-base">
                {insights.filter((q) => q.isSolved).length}/{insights.length}
              </h3>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center ${performanceColor}`}
            >
              <Sparkles size={18} />
            </div>

            <div>
              <p className="text-xs text-base-content/60">Performance</p>
              <h3 className={`font-bold text-sm ${performanceColor}`}>
                {performance}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {insights.map((question, index) => (
          <InsightsCard
            key={index}
            questionNumber={index + 1}
            questionName={question.questionName}
            questionLink={question.questionLink}
            codingMarks={question.codingMarks}
            timeComplexityMarks={question.timeComplexityMarks}
            spaceComplexityMarks={question.spaceComplexityMarks}
            totalMarks={
              question.questionType === "mcq"
                ? mcqMarksPerQuestion
                : (question.codingMarks || 0) +
              (question.timeComplexityMarks || 0) +
              (question.spaceComplexityMarks || 0)
            }
            remarks={question.remarks}
            questionType={question.questionType}
            options={question.options || []}
            selectedOption={question.selectedOption}
            correctOption={question.correctOption}
            isCorrect={question.isCorrect}
            mcqMarks={question.mcqMarks}
          />
        ))}
      </div>

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        loading={leaderboardLoading}
        error={leaderboardError}
        leaderboard={leaderboard}
        fullMarks={fullMarks}
      />
    </div>
  );
};

export default Insights;
