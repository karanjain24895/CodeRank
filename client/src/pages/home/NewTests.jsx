import React, { useEffect, useState } from "react";
import TestCard from "../../components/TestCard";
import axiosInstance from "../../lib/axios";

const NewTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Tests
  const fetchTests = async () => {
    try {
      setLoading(true);

      // Fetch all tests
      const testsRes = await axiosInstance.get("/test/all");

      // Fetch user submissions
      const submissionsRes = await axiosInstance.get("/submissions/me");

      const allTests = testsRes.data;
      const submissions = submissionsRes.data;

      // ✅ ONLY FINISHED TEST IDS
      const finishedTestIds = submissions
        .filter((s) => s.isFinished)
        .map((s) => s.test?._id);

      // ✅ NEW TESTS = NOT FINISHED
      const filteredTests = allTests.filter(
        (test) => !finishedTestIds.includes(test._id)
      );

      // Sort by nearest start time
      filteredTests.sort(
  (a, b) =>
    new Date(a.liveDateTime) - new Date(b.liveDateTime)
);

      setTests(filteredTests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
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
          New Tests
        </h1>

        <p className="text-base-content/70 mt-2 text-sm sm:text-base">
          Attempt upcoming coding tests 🚀
        </p>
      </div>

      {/* Test Cards */}
      <div className="space-y-4">

        {tests.length > 0 ? (
          tests.map((test, index) => (
            <TestCard
              key={test._id}
              testId={test._id}
              testNumber={index + 1}
              topicName={test.topicName}
              fullMarks={test.fullMarks}
              duration={test.duration}
              questionsCount={test.questions.length}
              liveDateTime={test.startDateTime}
            />
          ))
        ) : (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold">No New Tests</h2>
            <p className="text-base-content/60 mt-1 text-sm">
              All available tests are already attempted 🎉
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewTests;