import React from "react";
import {
  User,
  FileCode2,
  ArrowRight,
} from "lucide-react";

const SubmissionCard = ({
  username,
  topicName,
  onView,
}) => {

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

        {/* Left Side */}
        <div className="flex items-center gap-5">

          {/* User Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User size={28} />
          </div>

          {/* Details */}
          <div>

            <h2 className="text-2xl font-bold text-base-content">
              {username}
            </h2>

            <div className="flex items-center gap-2 mt-1 text-base-content/70">

              <FileCode2 size={16} />

              <p className="font-medium">
                {topicName}
              </p>
            </div>
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={onView}
          className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-2xl px-5 py-4 transition-all duration-300 flex items-center gap-3 border border-base-300"
        >

          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ArrowRight size={20} />
          </div>

          <div className="text-left">
            {/* <p className="text-sm opacity-70">
              Open
            </p> */}

            <h3 className="font-bold">
              View
            </h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SubmissionCard;