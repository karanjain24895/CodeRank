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

        <span className="loading loading-spinner loading-lg"></span>

      </div>
    );
  }

  if (!submission) {

    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
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
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Insights
        </h1>

        <p className="text-base-content/70 mt-3 text-lg">
          Detailed analysis of your coding performance 📊
        </p>
      </div>

      {/* Top Statistics */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md mb-8">

        {/* Topic */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold text-base-content">
            {topicName}
          </h2>

          <p className="text-base-content/60 mt-1">
            Performance Overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Score */}
          <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">

              <Trophy size={22} />

            </div>

            <div>

              <p className="text-sm text-base-content/60">
                Score
              </p>

              <h3 className="font-bold text-lg">
                {score}/{fullMarks}
              </h3>
            </div>
          </div>

          {/* Percentage */}
          <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">

              <Percent size={22} />

            </div>

            <div>

              <p className="text-sm text-base-content/60">
                Percentage
              </p>

              <h3 className="font-bold text-lg">
                {percentage}%
              </h3>
            </div>
          </div>

          {/* Questions Solved */}
          <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">

              <BookOpen size={22} />

            </div>

            <div>

              <p className="text-sm text-base-content/60">
                Solved
              </p>

              <h3 className="font-bold text-lg">
                {
                  insights.filter(
                    (q) => q.isSolved
                  ).length
                }/{insights.length}
              </h3>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

            <div className={`w-12 h-12 rounded-xl bg-base-100 flex items-center justify-center ${performanceColor}`}>

              <Sparkles size={22} />

            </div>

            <div>

              <p className="text-sm text-base-content/60">
                Performance
              </p>

              <h3 className={`font-bold text-lg ${performanceColor}`}>
                {performance}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-6">

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