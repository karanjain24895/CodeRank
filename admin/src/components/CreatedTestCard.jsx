import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Tags, Hash } from "lucide-react";
import axiosInstance from "../lib/axios";

const CreatedTestCard = ({ testId, testNumber, topicName, topics = [] }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test? This will also delete all related submissions."
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/test/${testId}`, {
        headers: { "x-admin-key": "mysecretadminkey" },
      });
      alert("Test deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Failed to delete test");
    }
  };

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">

          {/* Number Badge */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
            <Hash size={14} className="mr-0.5 opacity-60" />
            <span className="text-base">{testNumber}</span>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-base-content truncate">
              {topicName}
            </h2>

            {topics.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <Tags size={12} className="text-primary shrink-0" />
                {topics.slice(0, 4).map((topic) => (
                  <span
                    key={topic._id || topic.name}
                    className="badge badge-outline rounded-md px-2 py-1 text-[10px] font-medium"
                  >
                    {topic.name}
                  </span>
                ))}
                {topics.length > 4 && (
                  <span className="text-[10px] text-base-content/50 font-medium">
                    +{topics.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-base-content/50 mt-1">No topics assigned</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(`/edit-test/${testId}`)}
            className="btn btn-outline border-base-300 rounded-xl h-9 min-h-0 px-4 text-sm gap-1.5 hover:btn-primary"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-outline border-error/30 text-error rounded-xl h-9 min-h-0 px-4 text-sm gap-1.5 hover:btn-error hover:text-error-content"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatedTestCard;
