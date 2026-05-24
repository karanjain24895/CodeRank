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
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!test) {

    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Test Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        {/* Left */}
        <div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {test.topicName}
          </h1>

          <p className="text-base-content/70 mt-2">
            Solve all questions carefully within the given time 🚀
          </p>

          {/* Test Details */}
          <div className="flex flex-wrap gap-4 mt-6">

            {/* Total Marks */}
            <div className="bg-base-100 border border-base-300 rounded-2xl px-5 py-4 shadow-md flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">

                <Trophy size={22} />

              </div>

              <div>

                <p className="text-sm text-base-content/60">
                  Full Marks
                </p>

                <h3 className="text-lg font-bold text-base-content">
                  {test.fullMarks}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-base-100 border border-base-300 rounded-2xl px-5 py-4 shadow-md flex items-center gap-3 h-fit">

          <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">

            <Clock3 size={22} />

          </div>

          <div>

            <p className="text-sm text-base-content/60">
              Duration
            </p>

            <h3 className="text-lg font-bold text-base-content">
              {test.duration} Hours
            </h3>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-4 text-base-content">
          Instructions
        </h2>

        <ul className="space-y-3">

          {test.instructions.map(
            (
              instruction,
              index
            ) => (

              <li
                key={index}
                className="flex items-start gap-3 text-base-content/80"
              >

                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>

                <span>
                  {instruction}
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Questions */}
      <div className="space-y-5 mb-10">

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
          className="btn btn-primary rounded-2xl px-10 h-14 text-lg"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default CodingTest;

