import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, X, Send, User, Award, BookOpen, AlertCircle } from "lucide-react";
import axiosInstance from "../lib/axios";

const UploadInterviewResult = () => {
  const navigate = useNavigate();
  
  // Form State
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [testName, setTestName] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([
    { questionName: "", totalMarks: "", obtainedMarks: "", remarks: "" }
  ]);
  
  // Loading & UX State
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch registered users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Could not load users list. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle adding a topic
  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setTopicInput("");
    }
  };

  // Handle removing a topic
  const handleRemoveTopic = (indexToRemove) => {
    setTopics(topics.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle adding a question row
  const handleAddQuestionRow = () => {
    setQuestions([
      ...questions,
      { questionName: "", totalMarks: "", obtainedMarks: "", remarks: "" }
    ]);
  };

  // Handle removing a question row
  const handleRemoveQuestionRow = (indexToRemove) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, idx) => idx !== indexToRemove));
    }
  };

  // Handle question row field updates
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate main fields
    if (!selectedUserId) {
      setError("Please select a candidate user.");
      return;
    }
    if (!testName.trim()) {
      setError("Please enter the test/interview name.");
      return;
    }
    if (topics.length === 0) {
      setError("Please add at least one topic (e.g. React, JavaScript).");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionName.trim()) {
        setError(`Question #${i + 1} name is required.`);
        return;
      }
      if (q.totalMarks === "" || isNaN(q.totalMarks) || Number(q.totalMarks) <= 0) {
        setError(`Question #${i + 1} must have a valid Total Marks greater than 0.`);
        return;
      }
      if (q.obtainedMarks === "" || isNaN(q.obtainedMarks) || Number(q.obtainedMarks) < 0) {
        setError(`Question #${i + 1} must have a valid Obtained Marks (0 or greater).`);
        return;
      }
      if (Number(q.obtainedMarks) > Number(q.totalMarks)) {
        setError(`Question #${i + 1} Obtained Marks cannot exceed Total Marks.`);
        return;
      }
    }

    // Submit payload
    try {
      setSubmitting(true);
      const payload = {
        userId: selectedUserId,
        testName: testName.trim(),
        topics,
        questions: questions.map((q) => ({
          questionName: q.questionName.trim(),
          totalMarks: Number(q.totalMarks),
          obtainedMarks: Number(q.obtainedMarks),
          remarks: q.remarks.trim(),
        })),
      };

      await axiosInstance.post("/submissions/upload-interview", payload);
      setSuccess("Interview result uploaded successfully!");
      // Reset Form
      setTestName("");
      setTopics([]);
      setQuestions([{ questionName: "", totalMarks: "", obtainedMarks: "", remarks: "" }]);
      setSelectedUserId("");
      
      // Delay navigation to redirect cleanly
      setTimeout(() => {
        navigate("/submissions/history");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to upload interview result. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-300 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
            Upload Interview Result
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Store a candidate's evaluation, visible exclusively on their attempted tests panel.
          </p>
        </div>
      </div>

      {/* Message Notifications */}
      {error && (
        <div className="alert alert-error rounded-2xl shadow-sm text-sm py-3 px-4 flex gap-3 text-white">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success rounded-2xl shadow-sm text-sm py-3 px-4 flex gap-3 text-white">
          <Award size={20} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Candidate & Test Meta Information */}
        <div className="bg-base-200 border border-base-300 rounded-3xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
            <User size={18} className="text-primary" />
            Candidate & General Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Candidate User selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider block">
                Select Candidate
              </label>
              {loadingUsers ? (
                <div className="h-11 flex items-center pl-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="text-xs text-base-content/50 ml-2">Loading candidates...</span>
                </div>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="select select-bordered w-full rounded-xl h-11 bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} (@{u.username})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Test Name input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider block">
                Test / Interview Name
              </label>
              <input
                type="text"
                placeholder="e.g. Front-End Technical Interview"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="input input-bordered w-full rounded-xl h-11 bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Topics Tag Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider block">
              Interview Topics
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="e.g. React"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                className="input input-bordered flex-1 rounded-xl h-11 bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="btn btn-primary rounded-xl h-11 min-h-0 px-4 text-xs font-semibold"
              >
                Add Topic
              </button>
            </div>

            {/* Topics badge container */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {topics.map((topic, index) => (
                  <span
                    key={index}
                    className="badge badge-neutral gap-1.5 py-3 px-3 rounded-lg text-xs font-semibold bg-base-100 border border-base-300 flex items-center"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="hover:text-error transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Evaluation Questions Block */}
        <div className="bg-base-200 border border-base-300 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-base-300 pb-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Question & Grade Breakdown
            </h2>
            <button
              type="button"
              onClick={handleAddQuestionRow}
              className="btn btn-outline btn-primary rounded-xl h-9 min-h-0 px-3 text-xs font-semibold"
            >
              <Plus size={14} className="mr-1" /> Add Question Row
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-base-100 border border-base-300 rounded-2xl p-5 relative space-y-4"
              >
                {/* Heading / Row Action */}
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary rounded-md px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border-none">
                    Question #{idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestionRow(idx)}
                      className="btn btn-ghost btn-sm text-error rounded-lg hover:bg-error/10 hover:text-error p-1.5 shrink-0"
                      title="Remove question row"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Question name/title */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-xs font-medium text-base-content/65 block">Question Description / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Implement a custom debounce hook in React"
                      value={q.questionName}
                      onChange={(e) => handleQuestionChange(idx, "questionName", e.target.value)}
                      className="input input-bordered w-full rounded-xl h-11 bg-base-200 border-base-300 focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  {/* Total Marks */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-medium text-base-content/65 block">Total Marks</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={q.totalMarks}
                      onChange={(e) => handleQuestionChange(idx, "totalMarks", e.target.value)}
                      className="input input-bordered w-full rounded-xl h-11 bg-base-200 border-base-300 focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  {/* Obtained Marks */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-medium text-base-content/65 block">Obtained Marks</label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      value={q.obtainedMarks}
                      onChange={(e) => handleQuestionChange(idx, "obtainedMarks", e.target.value)}
                      className="input input-bordered w-full rounded-xl h-11 bg-base-200 border-base-300 focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="md:col-span-12 space-y-1.5">
                    <label className="text-xs font-medium text-base-content/65 block">Remarks / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Enter a brief note about the candidate's answer quality, weaknesses, or performance details."
                      value={q.remarks}
                      onChange={(e) => handleQuestionChange(idx, "remarks", e.target.value)}
                      className="textarea textarea-bordered w-full rounded-xl bg-base-200 border-base-300 focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/submissions/history")}
            className="btn btn-ghost rounded-xl h-11 min-h-0 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary rounded-xl h-11 min-h-0 px-6 text-sm font-semibold shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Send size={15} />
            )}
            Upload Result
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadInterviewResult;
