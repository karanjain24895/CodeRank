import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Trophy,
  Percent,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock3,
} from "lucide-react";

const AttemptedTestCard = ({

  topicName,

  scoredMarks,

  fullMarks,

  solvedQuestions,

  totalQuestions,

  submissionId,

  status,

}) => {

  const navigate =
    useNavigate();

  const isEvaluated =
    status === "evaluated";

  // Safe Percentage
  const percentage =
    fullMarks > 0
      ? Math.floor(
          (
            scoredMarks /
            fullMarks
          ) * 100
        )
      : 0;

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
  }

  else if (
    percentage < 50
  ) {

    performance =
      "Below Average";

    performanceColor =
      "text-orange-500";
  }

  else if (
    percentage < 70
  ) {

    performance =
      "Average";

    performanceColor =
      "text-warning";
  }

  else if (
    percentage < 90
  ) {

    performance =
      "Good";

    performanceColor =
      "text-info";
  }

  else {

    performance =
      "Excellent";

    performanceColor =
      "text-success";
  }

  return (

    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        {/* Topic */}
        <div>

          <h2 className="text-3xl font-bold text-base-content">
            {topicName}
          </h2>

        </div>

        {/* View Result */}
        {isEvaluated && (

          <button
            onClick={() =>
              navigate(
                `/insights/${submissionId}`
              )
            }

            className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-2xl px-3 py-2 transition-all duration-300 flex items-center gap-3 border border-base-300"
          >

            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

              <ArrowRight size={20} />

            </div>

            <div className="text-left">

              <h3 className="font-bold">
                View Result
              </h3>

            </div>
          </button>
        )}
      </div>

      {/* Pending Message */}
      {!isEvaluated ? (

        <div className="bg-base-200 rounded-2xl p-6 flex items-center gap-4 border border-warning/20">

          <div className="w-14 h-14 rounded-2xl bg-warning/10 text-warning flex items-center justify-center shrink-0">

            <Clock3 size={28} />

          </div>

          <div>

            <h3 className="text-xl font-bold text-warning">
              Your test has not been evaluated yet
            </h3>

            <p className="text-base-content/60 mt-1">
              Please wait until the admin completes the evaluation.
            </p>

          </div>
        </div>

      ) : (

        /* Bottom Row */
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
                {scoredMarks}/{fullMarks}
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

          {/* Solved */}
          <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">

              <CheckCircle2 size={22} />

            </div>

            <div>

              <p className="text-sm text-base-content/60">
                Solved
              </p>

              <h3 className="font-bold text-lg">
                {solvedQuestions}/{totalQuestions}
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
      )}
    </div>
  );
};

export default AttemptedTestCard;