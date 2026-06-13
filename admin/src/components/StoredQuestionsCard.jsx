import React from "react";

import {
  Pencil,
  Trash2,
} from "lucide-react";

const StoredQuestionsCard = ({
  question,
  questionNumber,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          
          {/* Number */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
            {questionNumber}
          </div>

          {/* Question Info */}
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              {question.questionName}
            </h2>

            <p className="text-base-content/60">
              Stored Question
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          
          {/* Marks */}
          <div className="px-5 py-3 rounded-2xl bg-success/10 text-success font-bold">
            {question.marks} Marks
          </div>

          {/* Edit */}
          <button
            onClick={() =>
              onEdit(question)
            }
            className="btn btn-primary rounded-2xl px-6"
          >
            <Pencil size={18} />
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={() =>
              onDelete(question._id)
            }
            className="btn btn-error rounded-2xl px-6"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoredQuestionsCard;