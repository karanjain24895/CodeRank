import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import SubmissionCard from "../components/SubmissionCard";
import axiosInstance from "../lib/axios";

const Submissions = ({
  newSubmissions = true,
}) => {

  const navigate =
    useNavigate();

  const [submissions,
    setSubmissions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  // Fetch submissions
  const fetchSubmissions =
    async () => {

      try {

        setLoading(true);
        setError("");

        const endpoint =
          newSubmissions
            ? "/submissions/pending"
            : "/submissions/all";


        const response =
          await axiosInstance.get(
            endpoint,
            {
            headers: {
              "x-admin-key":
                "mysecretadminkey",
            },
          }
          );

        setSubmissions(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "Fetch submissions error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
          "Failed to load submissions"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchSubmissions();

  }, [newSubmissions]);

  // Navigate to evaluation/details page
  const handleView =
    (submission) => {

      if (
        !submission?._id
      ) return;

      navigate(`/submissions/${submission._id}`);
    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

          {newSubmissions
            ? "New Submissions"
            : "Submission History"}

        </h1>

        <p className="text-base-content/70 mt-3 text-lg">

          {newSubmissions
            ? "Review and evaluate recent coding test submissions 🚀"
            : "View previously evaluated coding submissions 📚"}

        </p>

      </div>

      {/* Error */}
      {error && (

        <div className="alert alert-error mb-6 shadow-lg">

          <span>
            {error}
          </span>

        </div>
      )}

      {/* Loading */}
      {loading ? (

        <div className="flex justify-center items-center py-20">

          <span className="loading loading-spinner loading-lg"></span>

        </div>

      ) : submissions.length === 0 ? (

        /* Empty State */
        <div className="bg-base-100 rounded-2xl shadow-xl p-10 text-center border border-base-300">

          <h2 className="text-2xl font-bold mb-3">

            No submissions found

          </h2>

          <p className="text-base-content/70">

            {newSubmissions
              ? "There are no pending submissions right now."
              : "No submission history available yet."}

          </p>

        </div>

      ) : (

        /* Submission Cards */
        <div className="space-y-6">

          {submissions.map(
            (submission) => {

              const username =
                submission.user?.name ||

                submission.user?.username ||

                submission.user?.email ||

                "Unknown User";

              const topicName =
                submission.test?.topicName ||

                "Unknown Test";

              return (

                <SubmissionCard
                  key={
                    submission._id
                  }

                  username={
                    username
                  }

                  topicName={
                    topicName
                  }

                  status={
                    submission.status
                  }

                  createdAt={
                    submission.createdAt
                  }

                  onView={() =>
                    handleView(
                      submission
                    )
                  }
                />
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default Submissions;