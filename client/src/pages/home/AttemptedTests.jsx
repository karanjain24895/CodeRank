import React, {
  useEffect,
  useState,
} from "react";

import AttemptedTestCard from "../../components/AttemptedTestCard";

import axiosInstance from "../../lib/axios";

const AttemptedTests = () => {

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch Submissions
  const fetchSubmissions =
    async () => {

      try {

        const res =
          await axiosInstance.get(
            "/submissions/me"
          );

        setSubmissions(
          res.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchSubmissions();

  }, []);

  if (loading) {

  return (

    <div className="min-h-screen flex items-center justify-center">

      <span className="loading loading-spinner loading-md"></span>

    </div>
  );
}

return (

  <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4 sm:p-5">

    {/* Header */}
    <div className="mb-6">

      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Attempted Tests
      </h1>

      <p className="text-base-content/70 mt-2 text-sm sm:text-base">
        Review your coding test performances 📊
      </p>
    </div>

    {/* Cards */}
    <div className="space-y-4">

      {submissions.length > 0 ? (

        submissions.map(
          (
            submission,
            index
          ) => {

            // Evaluated Status
            const evaluated =
              submission.isEvaluated ||
              submission.status === "evaluated";

            // Total Score
            const score =
              submission.questions.reduce(
                (
                  total,
                  question
                ) => {

                  return (
                    total +
                    (question.codingMarks || 0) +
                    (question.timeComplexityMarks || 0) +
                    (question.spaceComplexityMarks || 0)
                  );
                },
                0
              );

            // Solved Questions
            const solvedQuestions =
              submission.questions.filter(
                (q) => q.isSolved
              ).length;

            // Total Questions
            const totalQuestions =
              submission.questions.length;

            // Percentage
            const percentage =
              submission.test?.fullMarks
                ? Math.floor(
                    (
                      score /
                      submission.test.fullMarks
                    ) * 100
                  )
                : 0;

            // Performance
            let performance =
              "";

            if (
              percentage < 20
            ) {

              performance =
                "Needs Improvement";

            } else if (
              percentage < 40
            ) {

              performance =
                "Below Average";

            } else if (
              percentage < 60
            ) {

              performance =
                "Average";

            } else if (
              percentage < 80
            ) {

              performance =
                "Good";

            } else {

              performance =
                "Excellent";
            }

            return (

              <AttemptedTestCard
                key={
                  submission._id
                }

                submissionId={
                  submission._id
                }

                topicName={
                  submission.test
                    ?.topicName
                }

                scoredMarks={
                  score
                }

                fullMarks={
                  submission.test
                    ?.fullMarks || 0
                }

                percentage={
                  percentage
                }

                solvedQuestions={
                  solvedQuestions
                }

                totalQuestions={
                  totalQuestions
                }

                performance={
                  performance
                }

                status={
                  submission.status
                }

                evaluated={
                  evaluated
                }
              />
            );
          }
        )

      ) : (

        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 text-center shadow-sm">

          <h2 className="text-xl font-bold">
            No Attempted Tests
          </h2>

          <p className="text-base-content/60 mt-1 text-sm">
            Your submissions will appear here.
          </p>
        </div>
      )}
    </div>
  </div>
);
};

export default AttemptedTests;