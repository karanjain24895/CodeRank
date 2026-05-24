import React from "react";
import {
  ExternalLink,
  Trophy,
} from "lucide-react";

const QuestionCard = ({
  questionNumber,
  title,
  marks,
  questionLink,
}) => {

  const handleOpenQuestion = () => {
    window.open(questionLink, "_blank");
  };

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          {/* Question Number */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg shrink-0">
            {questionNumber}
          </div>

          {/* Question Title */}
          <div>

            <h2 className="text-lg font-semibold text-base-content">
              {title}
            </h2>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Marks */}
          <div className="flex items-center gap-3 bg-base-200 rounded-2xl px-4 py-3">

            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Trophy size={18} />
            </div>

            <div>

              <p className="text-xs text-base-content/60">
                Marks
              </p>

              <h3 className="font-bold text-base-content">
                {marks}
              </h3>
            </div>
          </div>

          {/* Solve Button */}
          <button
            onClick={handleOpenQuestion}
            className="btn btn-primary rounded-2xl px-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >

            Solve

            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;