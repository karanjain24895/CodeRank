import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Loader2,
  Search,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import {
  CODING_QUESTION_COUNTS,
  CODING_SUBJECT,
  MCQ_SUBJECTS,
  MCQ_QUESTION_COUNTS,
} from "../constants/aiTest.constants";

const GenerateTestModal = ({ isOpen, onClose, mode = "coding" }) => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [testName, setTestName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(
    mode === "mcq" ? MCQ_SUBJECTS[0] : CODING_SUBJECT
  );
  const [topicFolderIds, setTopicFolderIds] = useState([]);
  const [questionCount, setQuestionCount] = useState(
    mode === "mcq" ? MCQ_QUESTION_COUNTS[0] : CODING_QUESTION_COUNTS[0]
  );
  const [topicSearch, setTopicSearch] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedSubject(mode === "mcq" ? MCQ_SUBJECTS[0] : CODING_SUBJECT);
    setQuestionCount(
      mode === "mcq" ? MCQ_QUESTION_COUNTS[0] : CODING_QUESTION_COUNTS[0]
    );
    setTopicFolderIds([]);
    setTopicSearch("");
    setSearchFocused(false);

    if (mode === "mcq") {
      setFolders([]);
      setLoadingTopics(false);
      return;
    }

    const fetchFolders = async () => {
      try {
        setLoadingTopics(true);
        setError("");

        const res = await axiosInstance.get("/question-folders");
        setFolders(res.data.folders || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load topics"
        );
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchFolders();
  }, [isOpen, mode]);

  const resetAndClose = () => {
    if (generating) return;

    setError("");
    setTopicSearch("");
    onClose();
  };

  const selectedTopics = folders.filter((folder) =>
    topicFolderIds.includes(folder._id)
  );
  const isCodingTest = mode === "coding";
  const isMcqTest = mode === "mcq";
  const questionCounts = isMcqTest
    ? MCQ_QUESTION_COUNTS
    : CODING_QUESTION_COUNTS;

  const availableTopics = folders.filter((folder) => {
    const alreadySelected = topicFolderIds.includes(folder._id);
    const matchesSearch = folder.name
      .toLowerCase()
      .includes(topicSearch.trim().toLowerCase());

    return !alreadySelected && matchesSearch;
  });

  const addTopic = (folderId) => {
    setError("");

    setTopicFolderIds((prev) => {
      if (prev.includes(folderId)) return prev;

      if (prev.length >= 5) {
        setError("You can select a maximum of 5 topics");
        return prev;
      }

      return [...prev, folderId];
    });

    setTopicSearch("");
  };

  const removeTopic = (folderId) => {
    setError("");
    setTopicFolderIds((prev) =>
      prev.filter((id) => id !== folderId)
    );
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!testName.trim()) {
      return setError("Test name is required");
    }

    if (isCodingTest && !topicFolderIds.length) {
      return setError("Select at least one topic");
    }

    try {
      setGenerating(true);
      setError("");

      const res = await axiosInstance.post("/ai-test/generate", {
        testName: testName.trim(),
        testType: isCodingTest ? "coding" : "mcq",
        subject: isCodingTest ? CODING_SUBJECT : selectedSubject,
        topicFolderIds: isCodingTest ? topicFolderIds : [],
        questionCount,
      });

      onClose();
      navigate(`/test/${res.data.test._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate test"
      );
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] grid place-items-center bg-neutral-950/60 backdrop-blur-md p-3 transition-all duration-300">
      <form
        onSubmit={handleGenerate}
        className="w-full max-w-xl max-h-[90dvh] bg-base-100 border border-base-300/80 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-base-300/60 bg-base-200/40">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-content flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
              <WandSparkles size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {isCodingTest
                  ? "Generate Coding Test"
                  : "Generate MCQ Test"}
              </h2>
              <p className="text-xs text-base-content/60 font-medium mt-0.5">
                {isCodingTest
                  ? "Choose question-bank topics for a coding test"
                  : "Choose a subject and let AI create MCQs"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-300/50 hover:scale-105 active:scale-95 transition-all"
            disabled={generating}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="alert alert-error py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm">
              {error}
            </div>
          )}

          {/* Test Name */}
          <label className="block">
            <span className="font-bold text-sm text-base-content/90 block mb-1.5">
              Test Name
            </span>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="input input-bordered input-md w-full rounded-xl text-sm border-base-300 bg-base-100/50 focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              placeholder="Enter Test Name"
              disabled={generating}
            />
          </label>

          {/* MCQ Topics List */}
          {isMcqTest && (
            <div>
              <span className="font-bold text-sm text-base-content/90 block mb-2">
                MCQ Topic
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MCQ_SUBJECTS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setError("");
                    }}
                    disabled={generating}
                    className={`w-full px-4 py-3 rounded-xl border text-left text-xs font-semibold transition-all duration-200 flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] ${
                      selectedSubject === subject
                        ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5"
                        : "border-base-300/80 bg-base-200/30 hover:bg-base-200/70 hover:border-base-content/10 text-base-content/85"
                    }`}
                  >
                    <span>{subject}</span>
                    {selectedSubject === subject && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2 animate-ping" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coding Topics List */}
          {isCodingTest && (
            <div className="relative">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="font-bold text-sm text-base-content/90">
                  Coding Topics
                </span>
                <span className="text-xs text-base-content/50 font-medium">
                  {topicFolderIds.length}/5 selected
                </span>
              </div>

              <div className="border border-base-300 bg-base-100/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
                <div className="min-h-12 px-3 py-2 flex flex-wrap items-center gap-1.5">
                  {selectedTopics.map((folder) => (
                    <span
                      key={folder._id}
                      className="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-base-200 border border-base-300/80 rounded-full text-xs font-semibold text-base-content/85 shadow-sm hover:bg-base-300/40 transition-colors"
                    >
                      <span className="truncate max-w-36">
                        {folder.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTopic(folder._id)}
                        className="w-4 h-4 rounded-full bg-base-content/10 hover:bg-base-content/20 text-base-content flex items-center justify-center shrink-0 transition"
                        disabled={generating}
                        aria-label={`Remove ${folder.name}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}

                  <div className="flex items-center gap-2 flex-1 min-w-40">
                    <Search
                      size={14}
                      className="text-base-content/40 shrink-0"
                    />
                    <input
                      type="text"
                      value={topicSearch}
                      onChange={(e) =>
                        setTopicSearch(e.target.value)
                      }
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full min-w-0 bg-transparent outline-none text-xs py-1"
                      placeholder={
                        selectedTopics.length
                          ? "Search more topics"
                          : "Search and select topics"
                      }
                      disabled={generating || loadingTopics}
                    />
                  </div>
                </div>
              </div>

              {/* Material Dropdown Suggestions Menu */}
              {searchFocused && (
                <div 
                  className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {loadingTopics ? (
                    <div className="py-6 flex items-center justify-center">
                      <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                  ) : availableTopics.length ? (
                    <div className="flex flex-col gap-0.5">
                      {availableTopics.map((folder) => (
                        <button
                          key={folder._id}
                          type="button"
                          onClick={() => {
                            addTopic(folder._id);
                            setTopicSearch("");
                          }}
                          disabled={generating}
                          className="w-full px-4 py-2 rounded-xl text-left text-xs font-semibold text-base-content/85 hover:bg-primary/10 hover:text-primary transition-all duration-150 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          {folder.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-base-content/50 font-medium">
                      No matching topics
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Question Count */}
          <div>
            <span className="font-bold text-sm text-base-content/90 block mb-2">
              Number of Questions
            </span>
            <div className="grid grid-cols-3 gap-2">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  disabled={generating}
                  className={`btn btn-md rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    questionCount === count
                      ? "btn-primary bg-gradient-to-r from-primary to-secondary border-none text-primary-content shadow-md shadow-primary/15"
                      : "btn-outline border-base-300 bg-base-100 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
            {isMcqTest && (
              <p className="text-xs text-base-content/60 mt-2 font-medium">
                Duration: {questionCount} minutes
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-300/60 bg-base-200/40 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="btn btn-ghost btn-md rounded-xl text-xs font-semibold hover:bg-base-300/50"
            disabled={generating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-md rounded-xl text-xs font-black bg-gradient-to-r from-primary to-secondary border-none text-primary-content shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all min-w-36"
            disabled={generating || loadingTopics}
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default GenerateTestModal;
