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

  useEffect(() => {
    if (!isOpen) return;

    setSelectedSubject(mode === "mcq" ? MCQ_SUBJECTS[0] : CODING_SUBJECT);
    setQuestionCount(
      mode === "mcq" ? MCQ_QUESTION_COUNTS[0] : CODING_QUESTION_COUNTS[0]
    );
    setTopicFolderIds([]);
    setTopicSearch("");

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
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/65 backdrop-blur-sm p-3">
      <form
        onSubmit={handleGenerate}
        className="w-full max-w-xl max-h-[88dvh] bg-base-100 border border-base-300 rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-base-300 bg-base-200/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center shrink-0 shadow-sm">
              <WandSparkles size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold truncate">
                {isCodingTest
                  ? "Generate Coding Test"
                  : "Generate MCQ Test"}
              </h2>
              <p className="text-xs text-base-content/60">
                {isCodingTest
                  ? "Choose question-bank topics for a coding test"
                  : "Choose a subject and let AI create MCQs"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="btn btn-ghost btn-xs btn-square"
            disabled={generating}
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {error && (
            <div className="alert alert-error py-1.5 text-xs">
              {error}
            </div>
          )}

          <label className="block">
            <span className="font-bold text-sm block mb-1.5">
              Test Name
            </span>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="input input-bordered input-sm w-full rounded-lg text-sm"
              placeholder="Example: Backend Interview Practice"
              disabled={generating}
            />
          </label>

          {isMcqTest && (
          <div>
            <span className="font-bold text-sm block mb-1.5">
              MCQ Topic
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {MCQ_SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject);
                    setError("");
                  }}
                  disabled={generating}
                  className={`btn btn-sm rounded-lg text-xs h-auto min-h-9 whitespace-normal leading-tight ${
                    selectedSubject === subject
                      ? "btn-primary"
                      : "btn-outline bg-base-100"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
          )}

          {isCodingTest && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-sm">
                Coding Topics
              </span>
              <span className="text-xs text-base-content/60">
                {topicFolderIds.length}/5 selected
              </span>
            </div>

            <div className="border border-base-300 rounded-lg bg-base-100 focus-within:border-primary transition">
              <div className="min-h-9 px-2 py-1.5 flex flex-wrap items-center gap-1.5">
                {selectedTopics.map((folder) => (
                  <span
                    key={folder._id}
                    className="badge badge-primary gap-1.5 px-2 py-2.5 rounded-md max-w-full text-[11px]"
                  >
                    <span className="truncate max-w-36">
                      {folder.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTopic(folder._id)}
                      className="grid place-items-center"
                      disabled={generating}
                      aria-label={`Remove ${folder.name}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1.5 flex-1 min-w-40">
                  <Search
                    size={13}
                    className="text-base-content/40 shrink-0"
                  />
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) =>
                      setTopicSearch(e.target.value)
                    }
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

            {loadingTopics ? (
              <div className="mt-1.5 h-16 flex items-center justify-center bg-base-200 rounded-lg">
                <span className="loading loading-spinner loading-sm" />
              </div>
            ) : (
              <div className="mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-base-300 bg-base-200/70 p-1">
                {availableTopics.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {availableTopics.map((folder) => (
                      <button
                        key={folder._id}
                        type="button"
                        onClick={() => addTopic(folder._id)}
                        disabled={generating}
                        className="h-6 px-1.5 rounded border border-base-300 bg-base-100 text-left text-[11px] leading-none font-medium hover:border-primary hover:text-primary transition truncate"
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-12 grid place-items-center text-xs text-base-content/60">
                    No matching topics
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          <div>
            <span className="font-bold text-sm block mb-1.5">
              Number of Questions
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  disabled={generating}
                  className={`btn btn-sm rounded-lg text-xs ${
                    questionCount === count
                      ? "btn-primary"
                      : "btn-outline bg-base-100"
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
            {isMcqTest && (
              <p className="text-xs text-base-content/60 mt-1.5">
                Duration: {questionCount} minutes
              </p>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-base-300 bg-base-200/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-1.5">
          <button
            type="button"
            onClick={resetAndClose}
            className="btn btn-ghost btn-sm rounded-lg"
            disabled={generating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-lg min-w-32"
            disabled={generating || loadingTopics}
          >
            {generating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles size={13} />
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
