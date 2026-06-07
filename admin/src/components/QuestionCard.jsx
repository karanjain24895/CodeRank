import React from "react";
import {
  FileText,
  Link2,
  Tags,
  Trophy,
  Trash2,
  WandSparkles,
} from "lucide-react";

const QuestionCard = ({
  index,
  question,
  onChange,
  onRemove,
}) => {
  return (
    <div className="bg-base-100 border border-base-300 rounded-3xl shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-base-300 bg-base-200/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            {index + 1}
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Question {index + 1}
            </h3>
            <p className="text-sm text-base-content/60">
              Fill in the coding question details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="btn btn-error btn-sm rounded-xl"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Title
            </span>
          </label>

          <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">
            <FileText size={18} className="opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Enter question title"
              value={question.title}
              onChange={(e) =>
                onChange(index, "title", e.target.value)
              }
            />
          </label>
        </div>

        {/* Problem */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Problem
            </span>
          </label>

          <textarea
            className="textarea textarea-bordered rounded-2xl w-full min-h-40"
            placeholder="Paste the full problem statement here..."
            value={question.problem}
            onChange={(e) =>
              onChange(index, "problem", e.target.value)
            }
          />
        </div>

        {/* Link */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Problem Link
            </span>
          </label>

          <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">
            <Link2 size={18} className="opacity-70" />
            <input
              type="url"
              className="grow"
              placeholder="https://..."
              value={question.link}
              onChange={(e) =>
                onChange(index, "link", e.target.value)
              }
            />
          </label>
        </div>

        {/* Topic / Difficulty / Marks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Topic
              </span>
            </label>

            <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">
              <Tags size={18} className="opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Array"
                value={question.topic}
                onChange={(e) =>
                  onChange(index, "topic", e.target.value)
                }
              />
            </label>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Difficulty
              </span>
            </label>

            <select
              className="select select-bordered rounded-2xl h-14 w-full"
              value={question.difficulty}
              onChange={(e) =>
                onChange(index, "difficulty", e.target.value)
              }
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Marks
              </span>
            </label>

            <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">
              <Trophy size={18} className="opacity-70" />
              <input
                type="number"
                min="1"
                className="grow"
                placeholder="10"
                value={question.marks}
                onChange={(e) =>
                  onChange(index, "marks", e.target.value)
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;