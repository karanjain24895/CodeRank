import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import QuestionCard from "../../components/QuestionCard";

import {
  Clock3,
  Trophy,
} from "lucide-react";

import axiosInstance from "../../lib/axios";

const CodingTest = () => {

  const { id: testId } = useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [test, setTest] =
    useState(null);

  // Fetch Test
  useEffect(() => {

    const fetchTest =
      async () => {

        try {

          const res =
            await axiosInstance.get(
              `/test/${testId}`
            );

          setTest(
            res.data
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchTest();

  }, [testId]);

  // Submit Test
  const handleSubmit =
    async () => {

      try {

        await axiosInstance.post(
          `/submissions/${testId}`
        );

        alert(
          "Test Submitted Successfully"
        );

        navigate(
          "/attempted-tests"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Submission Failed"
        );
      }
    };

  if (loading) {

  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      Loading...
    </div>
  );
}

if (!test) {

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Test Not Found
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4 sm:p-5">

    {/* Header */}
    <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

      {/* Left */}
      <div>

        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {test.topicName}
        </h1>

        <p className="text-base-content/70 mt-1 text-sm sm:text-base">
          Solve all questions carefully within the given time 🚀
        </p>

        {/* Test Details */}
        <div className="flex flex-wrap gap-3 mt-4">

          {/* Total Marks */}
          <div className="bg-base-100 border border-base-300 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">

              <Trophy size={18} />

            </div>

            <div>

              <p className="text-xs text-base-content/60">
                Full Marks
              </p>

              <h3 className="text-base font-bold text-base-content">
                {test.fullMarks}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-base-100 border border-base-300 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 h-fit">

        <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">

          <Clock3 size={18} />

        </div>

        <div>

          <p className="text-xs text-base-content/60">
            Duration
          </p>

          <h3 className="text-base font-bold text-base-content">
            {test.duration} Hours
          </h3>
        </div>
      </div>
    </div>

    {/* Instructions */}
    <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm mb-6">

      <h2 className="text-xl font-bold mb-3 text-base-content">
        Instructions
      </h2>

      <ul className="space-y-2">

        {test.instructions.map(
          (
            instruction,
            index
          ) => (

            <li
              key={index}
              className="flex items-start gap-2 text-sm text-base-content/80"
            >

              <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>

              <span>
                {instruction}
              </span>
            </li>
          )
        )}
      </ul>
    </div>

    {/* Questions */}
    <div className="space-y-4 mb-8">

      {test.questions.map(
        (
          question,
          index
        ) => (

          <QuestionCard
            key={index}
            questionNumber={
              index + 1
            }
            title={
              question.questionName
            }
            marks={
              question.marks
            }
            questionLink={
              question.questionLink
            }
          />
        )
      )}
    </div>

    {/* Submit Button */}
    <div className="flex justify-end">

      <button
        onClick={
          handleSubmit
        }
        className="btn btn-primary rounded-xl px-6 h-11 min-h-0 text-sm sm:text-base"
      >
        Submit Test
      </button>
    </div>
  </div>
);
};

export default CodingTest;

