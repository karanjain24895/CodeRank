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
  <div className="w-full bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Left Section */}
      <div className="flex items-center gap-3">

        {/* Question Number */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
          {questionNumber}
        </div>

        {/* Question Title */}
        <div>

          <h2 className="text-base font-semibold text-base-content">
            {title}
          </h2>

        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Marks */}
        <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2">

          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Trophy size={16} />
          </div>

          <div>

            <p className="text-[11px] text-base-content/60 leading-none mb-1">
              Marks
            </p>

            <h3 className="font-bold text-sm text-base-content">
              {marks}
            </h3>
          </div>
        </div>

        {/* Solve Button */}
        <button
          onClick={handleOpenQuestion}
          className="btn btn-primary rounded-xl px-4 h-10 min-h-0 text-sm shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
        >

          Solve

          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  </div>
);
};

export default QuestionCard;