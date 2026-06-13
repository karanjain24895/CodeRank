import React, { useEffect, useState } from "react";
import CreatedTestCard from "../components/CreatedTestCard";
import axiosInstance from "../lib/axios";
import { LayoutDashboard, RefreshCw, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatedTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/test/all", {
        headers: { "x-admin-key": "mysecretadminkey" },
      });
      // Support both paginated { tests: [...] } and plain array responses
      const data = res.data;
      setTests(Array.isArray(data) ? data : data.tests || []);
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
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/60 font-medium">Loading tests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <LayoutDashboard size={16} />
            </div>
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
              Tests
            </p>
          </div>
          <h1 className="text-3xl font-bold text-base-content">
            Created Tests
          </h1>
          <p className="text-base-content/60 mt-1 text-sm">
            {tests.length} test{tests.length !== 1 ? "s" : ""} available · Manage and edit your coding tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTests}
            className="btn btn-outline border-base-300 rounded-xl h-10 min-h-0 px-3 gap-2 text-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/create-test")}
            className="btn btn-primary rounded-xl h-10 min-h-0 px-4 gap-2 text-sm"
          >
            <PlusCircle size={15} />
            Create Test
          </button>
        </div>
      </div>

      {/* ── Test Cards ──────────────────────────────────────── */}
      {tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test, index) => (
            <CreatedTestCard
              key={test._id}
              testId={test._id}
              testNumber={index + 1}
              topicName={test.topicName}
              topics={test.topics || []}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">No Tests Created</h2>
          <p className="text-base-content/60 mb-6">
            Create your first coding test to get started.
          </p>
          <button
            onClick={() => navigate("/create-test")}
            className="btn btn-primary rounded-xl px-6"
          >
            <PlusCircle size={16} />
            Create First Test
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatedTests;
