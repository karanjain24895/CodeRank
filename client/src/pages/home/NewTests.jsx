import { useEffect, useState, useCallback } from "react";
import TestCard from "../../components/TestCard";
import AttemptedTestCard from "../../components/AttemptedTestCard";
import axiosInstance from "../../lib/axios";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
} from "lucide-react";

const PAGE_SIZE = 10;

const FILTERS = [
  { key: "all",      label: "All" },
  { key: "live",     label: "🔴 Live" },
  { key: "upcoming", label: "⏰ Upcoming" },
  { key: "attempted",label: "✅ Attempted" },
];

const NewTests = () => {
  // ── Tests (paginated from server) ────────────────────────────────────────
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ── Submissions (fetched once on mount, for display on Attempted tab) ─────
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);

  // ── Filter ───────────────────────────────────────────────────────────────
  const [filterMode, setFilterMode] = useState("all");

  // Fetch submissions once on mount
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axiosInstance.get("/submissions/me");
        setSubmissions(res.data || []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setSubmissionsLoaded(true);
      }
    };
    fetchSubmissions();
  }, []);

  // Fetch tests whenever page or filterMode changes
  const fetchTests = useCallback(async () => {
    if (!submissionsLoaded) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get("/test/all", {
        params: {
          page,
          limit: PAGE_SIZE,
          filterMode,
        },
      });
      const { tests: rawTests, totalPages: tp, totalCount: tc } = res.data;
      setTests(rawTests);
      setTotalPages(tp);
      setTotalCount(tc);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, filterMode, submissionsLoaded]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Reset to page 1 on filter change
  const handleFilterChange = (key) => {
    setFilterMode(key);
    setPage(1);
  };

  // Helper to find the submission for a test ID (for Attempted tab)
  const getSubmission = (testId) =>
    submissions.find((s) => s.test?._id === testId && s.isFinished);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4 sm:p-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tests
        </h1>
        <p className="text-base-content/60 mt-1 text-sm">
          Browse available tests · {totalCount} total
        </p>
      </div>

      {/* ── Filter Chips ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 bg-base-100 border border-base-300 rounded-xl p-1 shadow-sm w-fit mb-6">
        <ListFilter size={14} className="text-base-content/40 ml-2 shrink-0" />
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filterMode === key
                ? "bg-primary text-primary-content shadow-sm"
                : "hover:bg-base-200 text-base-content/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm text-base-content/50">Loading tests…</p>
        </div>
      ) : tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test, index) => {
            const sub = getSubmission(test._id);
            const isAttempted = Boolean(sub);

            if (filterMode === "attempted" || isAttempted) {
              if (filterMode === "attempted" && !sub) return null;

              const score = sub ? sub.questions.reduce(
                (t, q) =>
                  t +
                  (q.mcqMarks || 0) +
                  (q.codingMarks || 0) +
                  (q.timeComplexityMarks || 0) +
                  (q.spaceComplexityMarks || 0),
                0
              ) : 0;
              const solvedQuestions = sub ? sub.questions.filter((q) => q.isSolved).length : 0;
              const totalQuestions = sub ? sub.questions.length : 0;

              return (
                <AttemptedTestCard
                  key={sub?._id || test._id}
                  submissionId={sub?._id}
                  topicName={test.topicName}
                  topics={
                    test.testType === "mcq"
                      ? test.subject ? [{ name: test.subject }] : []
                      : test.topics || []
                  }
                  scoredMarks={score}
                  fullMarks={test.fullMarks || 0}
                  solvedQuestions={solvedQuestions}
                  totalQuestions={totalQuestions}
                  status={sub?.status}
                  evaluated={sub?.isEvaluated}
                  finished={sub?.isFinished}
                  sourceType={test.sourceType}
                />
              );
            }

            return (
              <TestCard
                key={test._id}
                testId={test._id}
                testNumber={(page - 1) * PAGE_SIZE + index + 1}
                topicName={test.topicName}
                testType={test.testType}
                fullMarks={test.fullMarks}
                duration={test.duration}
                topics={test.topics || []}
                questionsCount={
                  test.questions?.length ||
                  test.questionRefs?.length ||
                  0
                }
                liveDateTime={test.startDateTime}
                sourceType={test.sourceType}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center shadow-sm">
          <div className="text-4xl mb-3">
            {filterMode === "attempted" ? "📭" : "🎉"}
          </div>
          <h2 className="text-xl font-bold">
            {filterMode === "live"      ? "No Live Tests Right Now" :
             filterMode === "upcoming"  ? "No Upcoming Tests" :
             filterMode === "attempted" ? "No Attempted Tests Yet" :
                                         "No Tests Available"}
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            {filterMode === "attempted"
              ? "Tests you've completed will appear here."
              : "Try switching the filter above."}
          </p>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-base-content/50 order-2 sm:order-1">
            Page <span className="font-bold text-base-content">{page}</span> of{" "}
            <span className="font-bold text-base-content">{totalPages}</span>
            {" · "}
            <span className="font-bold text-base-content">{totalCount}</span> tests total
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "…" ? (
                  <span key={`e-${idx}`} className="px-1.5 text-base-content/30 text-sm">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`btn btn-sm rounded-xl min-w-[2.25rem] ${
                      item === page ? "btn-primary" : "btn-ghost border border-base-300"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTests;
