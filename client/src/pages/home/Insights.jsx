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
} from "lucide-react";

const Insights = () => {

  const { submissionId } =
    useParams();

  const [loading, setLoading] =
    useState(true);

  const [submission, setSubmission] =
    useState(null);

  // Fetch Submission
  useEffect(() => {

    const fetchSubmission =
      async () => {

        try {

          const res =
            await axiosInstance.get(
              `/submissions/${submissionId}`
            );

          setSubmission(
            res.data
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchSubmission();

  }, [submissionId]);

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

const topicName =
  submission.test.topicName;

const insights =
  submission.questions;

// Total Score
const score =
  insights.reduce(
    (
      total,
      question
    ) => {

      return (
        total +
        question.codingMarks +
        question.timeComplexityMarks +
        question.spaceComplexityMarks
      );
    },
    0
  );

// Full Marks
const fullMarks =
  submission.test.fullMarks;

// Percentage
const percentage =
  Math.floor(
    (
      score / fullMarks
    ) * 100
  );

// Performance
let performance =
  "";

let performanceColor =
  "";

if (percentage < 30) {

  performance =
    "Needs Improvement";

  performanceColor =
    "text-error";

} else if (
  percentage < 50
) {

  performance =
    "Below Average";

  performanceColor =
    "text-orange-500";

} else if (
  percentage < 70
) {

  performance =
    "Average";

  performanceColor =
    "text-warning";

} else if (
  percentage < 90
) {

  performance =
    "Good";

  performanceColor =
    "text-info";

} else {

  performance =
    "Excellent";

  performanceColor =
    "text-success";
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
      <div className="mb-4">

        <h2 className="text-2xl font-bold text-base-content">
          {topicName}
        </h2>

        <p className="text-base-content/60 mt-1 text-sm">
          Performance Overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Score */}
        <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">

            <Trophy size={18} />

          </div>

          <div>

            <p className="text-xs text-base-content/60">
              Score
            </p>

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

            <p className="text-xs text-base-content/60">
              Percentage
            </p>

            <h3 className="font-bold text-base">
              {percentage}%
            </h3>
          </div>
        </div>

        {/* Questions Solved */}
        <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">

            <BookOpen size={18} />

          </div>

          <div>

            <p className="text-xs text-base-content/60">
              Solved
            </p>

            <h3 className="font-bold text-base">
              {
                insights.filter(
                  (q) => q.isSolved
                ).length
              }/{insights.length}
            </h3>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

          <div className={`w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center ${performanceColor}`}>

            <Sparkles size={18} />

          </div>

          <div>

            <p className="text-xs text-base-content/60">
              Performance
            </p>

            <h3 className={`font-bold text-sm ${performanceColor}`}>
              {performance}
            </h3>
          </div>
        </div>
      </div>
    </div>

    {/* Insights Cards */}
    <div className="space-y-4">

      {insights.map(
        (
          question,
          index
        ) => (

          <InsightsCard
            key={index}
            questionNumber={
              index + 1
            }
            questionName={
              question.questionName
            }
            questionLink={
              question.questionLink
            }
            codingMarks={
              question.codingMarks
            }
            timeComplexityMarks={
              question.timeComplexityMarks
            }
            spaceComplexityMarks={
              question.spaceComplexityMarks
            }
            totalMarks={
              question.codingMarks +
              question.timeComplexityMarks +
              question.spaceComplexityMarks
            }
            remarks={
              question.remarks
            }
          />
        )
      )}
    </div>
  </div>
);
};

export default Insights;