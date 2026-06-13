import React, { useEffect, useState } from "react";
import AttemptedTestCard from "../../components/AttemptedTestCard";
import axiosInstance from "../../lib/axios";
import {
  ListFilter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PAGE_SIZE = 10;

const FILTERS = [
  { key: "all",       label: "All" },
  { key: "pending",   label: "⏳ Pending" },
  { key: "evaluated", label: "✅ Evaluated" },
];

const AttemptedTests = () => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch all submissions once
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axiosInstance.get("/submissions/me");
        // Keep only finished (submitted) tests, sorted newest first
        const finished = (res.data || [])
          .filter((s) => s.isFinished === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllSubmissions(finished);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Handle filter change — reset to page 1
  const handleFilterChange = (key) => {
    setFilterMode(key);
    setPage(1);
  };

  // ── Apply filter ─────────────────────────────────────────────────────────
  const filtered = allSubmissions.filter((s) => {
    if (filterMode === "pending")   return !s.isEvaluated;
    if (filterMode === "evaluated") return  s.isEvaluated;
    return true;
  });

  // ── Paginate ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4 sm:p-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Attempted Tests
        </h1>
        <p className="text-base-content/60 mt-1 text-sm">
          Review your performance · {allSubmissions.length} submitted
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
          <p className="text-sm text-base-content/50">Loading your tests…</p>
        </div>
      ) : paginated.length > 0 ? (
        <div className="space-y-4">
          {paginated.map((submission) => {
            const score = submission.questions.reduce(
              (total, q) =>
                total +
                (q.mcqMarks || 0) +
                (q.codingMarks || 0) +
                (q.timeComplexityMarks || 0) +
                (q.spaceComplexityMarks || 0),
              0
            );
            const solvedQuestions = submission.questions.filter((q) => q.isSolved).length;
            const totalQuestions  = submission.questions.length;
            const percentage      = submission.test?.fullMarks
              ? Math.floor((score / submission.test.fullMarks) * 100)
              : 0;

            return (
              <AttemptedTestCard
                key={submission._id}
                submissionId={submission._id}
                topicName={submission.test?.topicName}
                topics={
                  submission.test?.testType === "mcq"
                    ? submission.test?.subject
                      ? [{ name: submission.test.subject }]
                      : []
                    : submission.test?.topics || submission.test?.topicFolderIds || []
                }
                scoredMarks={score}
                fullMarks={submission.test?.fullMarks || 0}
                percentage={percentage}
                solvedQuestions={solvedQuestions}
                totalQuestions={totalQuestions}
                status={submission.status}
                evaluated={submission.isEvaluated}
                finished={submission.isFinished}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <h2 className="text-xl font-bold">
            {filterMode === "pending"   ? "No Pending Tests" :
             filterMode === "evaluated" ? "No Evaluated Tests Yet" :
                                          "No Attempted Tests"}
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            {filterMode === "all"
              ? "Your submitted tests will appear here."
              : "Try switching the filter above."}
          </p>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-base-content/50 order-2 sm:order-1">
            Page <span className="font-bold text-base-content">{safePage}</span> of{" "}
            <span className="font-bold text-base-content">{totalPages}</span>
            {" · "}
            <span className="font-bold text-base-content">{filtered.length}</span> submissions
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
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
                      item === safePage ? "btn-primary" : "btn-ghost border border-base-300"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="btn btn-ghost btn-sm rounded-xl border border-base-300 disabled:opacity-30"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
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

export default AttemptedTests;
