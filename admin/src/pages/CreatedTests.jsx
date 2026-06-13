import React, {
  useEffect,
  useState,
} from "react";

import CreatedTestCard from "../components/CreatedTestCard";

import axiosInstance from "../lib/axios";

const CreatedTests = () => {

  const [tests, setTests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch Tests
  const fetchTests = async () => {

    try {

      const res =
        await axiosInstance.get(
          "/test/all",
          {
            headers: {
              "x-admin-key":
                "mysecretadminkey",
            },
          }
        );

      setTests(res.data);

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

        <span className="loading loading-spinner loading-lg"></span>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Created Tests
        </h1>

        <p className="text-base-content/70 mt-3 text-lg">
          Manage and edit your coding tests 🚀
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-6">

        {tests.length > 0 ? (

          tests.map(
            (test, index) => (

              <CreatedTestCard
                key={test._id}
                testId={test._id}
                testNumber={
                  index + 1
                }
                topicName={
                  test.topicName
                }
                topics={
                  test.topics || []
                }
              />
            )
          )

        ) : (

          <div className="bg-base-100 border border-base-300 rounded-3xl p-10 text-center shadow-md">

            <h2 className="text-2xl font-bold">
              No Tests Created
            </h2>

            <p className="text-base-content/60 mt-2">
              Create your first test.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedTests;
