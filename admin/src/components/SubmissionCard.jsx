import React from "react";
import {
  User,
  FileCode2,
  ClipboardList,
  ArrowRight,
  Clock,
  CheckCircle2,
  Timer,
} from "lucide-react";

const SubmissionCard = ({
  username,
  topicName,
  testType = "coding",
  status = "pending",
  createdAt,
  onView,
}) => {
  const isMcq = testType === "mcq";
  const isEvaluated = status === "evaluated";

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Type Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isMcq
                ? "bg-secondary/10 text-secondary"
                : "bg-primary/10 text-primary"
            }`}
          >
            {isMcq ? <ClipboardList size={22} /> : <FileCode2 size={22} />}
          </div>

          {/* Details */}
          <div>
            {/* Status badges */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`badge badge-sm font-semibold text-[10px] uppercase tracking-wider ${
                  isMcq ? "badge-secondary" : "badge-primary"
                }`}
              >
                {isMcq ? "MCQ" : "Coding"}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                  isEvaluated
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-warning/10 border-warning/30 text-warning"
                }`}
              >
                {isEvaluated ? (
                  <CheckCircle2 size={10} />
                ) : (
                  <Timer size={10} />
                )}
                {isEvaluated ? "Evaluated" : "Pending"}
              </span>
            </div>

            <h2 className="text-base font-bold text-base-content">{username}</h2>

            <div className="flex items-center gap-1.5 mt-0.5 text-base-content/60">
              <User size={12} />
              <p className="text-sm font-medium">{topicName}</p>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-1.5 mt-0.5 text-base-content/40">
                <Clock size={11} />
                <p className="text-xs">{formattedDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Evaluate Button */}
        <button
          onClick={onView}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-base-200 border border-base-300 rounded-xl hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-200 shrink-0 group"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 group-hover:bg-primary-content/20 flex items-center justify-center transition-all">
            <ArrowRight size={15} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm">Evaluate</h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SubmissionCard;