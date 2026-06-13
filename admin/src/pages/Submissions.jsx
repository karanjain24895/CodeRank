import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionCard from "../components/SubmissionCard";
import axiosInstance from "../lib/axios";
import { ClipboardList, FileCode, RefreshCw } from "lucide-react";

const Submissions = ({ newSubmissions = true }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = newSubmissions
        ? "/submissions/pending"
        : "/submissions/all";
      const response = await axiosInstance.get(endpoint, {
        headers: { "x-admin-key": "mysecretadminkey" },
      });
      setSubmissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch submissions error:", error);
      setError(
        error.response?.data?.message || "Failed to load submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [newSubmissions]);

  const handleView = (submission) => {
    if (!submission?._id) return;
    navigate(`/submissions/${submission._id}`);
  };

  const Icon = newSubmissions ? ClipboardList : FileCode;

  return (
    <div className="min-h-screen bg-base-100 p-6">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${newSubmissions ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
              <Icon size={16} />
            </div>
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
              Submissions
            </p>
          </div>
          <h1 className="text-3xl font-bold text-base-content">
            {newSubmissions ? "New Submissions" : "Submission History"}
          </h1>
          <p className="text-base-content/60 mt-1 text-sm">
            {newSubmissions
              ? "Review and evaluate recent coding test submissions"
              : "View all previously evaluated submissions"}
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          className="btn btn-outline border-base-300 rounded-xl h-10 min-h-0 px-3 gap-2 text-sm"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="alert alert-error mb-6 rounded-2xl">
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ── Content ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/60 font-medium">Loading submissions…</p>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-12 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${newSubmissions ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
            <Icon size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">No Submissions Found</h2>
          <p className="text-base-content/60">
            {newSubmissions
              ? "There are no pending submissions right now. Check back later."
              : "No submission history available yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Count chip */}
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-outline rounded-lg px-3 py-2 text-xs font-semibold">
              {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {submissions.map((submission) => {
            const username =
              submission.user?.name ||
              submission.user?.username ||
              submission.user?.email ||
              "Unknown User";
            const topicName = submission.test?.topicName || "Unknown Test";
            const testType = submission.test?.testType || "coding";
            return (
              <SubmissionCard
                key={submission._id}
                username={username}
                topicName={topicName}
                testType={testType}
                status={submission.status}
                createdAt={submission.createdAt}
                onView={() => handleView(submission)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Submissions;