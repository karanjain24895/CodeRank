import React from "react";
import {
    Code2,
    Timer,
    Database,
    Trophy,
    MessageSquareText,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const InsightsCard = ({
    questionNumber,
    questionName,
    questionLink,
    codingMarks,
    timeComplexityMarks,
    spaceComplexityMarks,
    totalMarks,
    remarks,
    questionType = "coding",
    options = [],
    selectedOption,
    correctOption,
    isCorrect,
    mcqMarks,
}) => {

    if (questionType === "mcq") {
        return (
            <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {questionNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-base-content">
                            {questionName}
                        </h2>
                        <div
                            className={`mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold border ${
                                isCorrect
                                    ? "bg-success/10 text-success border-success/30"
                                    : "bg-error/10 text-error border-error/30"
                            }`}
                        >
                            {isCorrect ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <XCircle size={16} />
                            )}
                            {mcqMarks || 0}/{totalMarks || 1}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2 mb-4">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border px-4 py-3 flex gap-3 ${
                                index === correctOption
                                    ? "border-success bg-success/10"
                                    : index === selectedOption
                                    ? "border-error bg-error/10"
                                    : "border-base-300 bg-base-200"
                            }`}
                        >
                            <span className="font-bold">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            <span>{option}</span>
                        </div>
                    ))}
                </div>

            </div>
        );
    }

    return (
        <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

                {/* Left Side */}
                <div className="flex items-center gap-3">

                    {/* Question Number */}
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {questionNumber}
                    </div>

                    {/* Question Name */}
                    <div>

                        <h2 className="text-lg sm:text-xl font-bold text-base-content">
                            {questionName}
                        </h2>

                    </div>
                </div>

                {/* View Question Button */}
                <button
                    onClick={() =>
                        window.open(
                            questionLink,
                            "_blank"
                        )
                    }

                    className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-xl px-3 py-2 transition-all duration-300 flex items-center gap-2 border border-base-300"
                >

                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code2 size={16} />
                    </div>

                    <div className="text-left">

                        <h3 className="font-semibold text-sm">
                            View Question
                        </h3>

                    </div>
                </button>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">

                {/* Coding Marks */}
                <div className="bg-base-200 border border-base-300 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Code2 size={18} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60">
                            Coding Marks
                        </p>

                        <h3 className="font-bold text-base">
                            {codingMarks}
                        </h3>
                    </div>
                </div>

                {/* Time Complexity */}
                <div className="bg-base-200 border border-base-300 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <Timer size={18} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60">
                            Time Complexity
                        </p>

                        <h3 className="font-bold text-base">
                            {timeComplexityMarks}
                        </h3>
                    </div>
                </div>

                {/* Space Complexity */}
                <div className="bg-base-200 border border-base-300 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Database size={18} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60">
                            Space Complexity
                        </p>

                        <h3 className="font-bold text-base">
                            {spaceComplexityMarks}
                        </h3>
                    </div>
                </div>

                {/* Total Marks */}
                <div className="bg-base-200 border border-base-300 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                        <Trophy size={18} />
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60">
                            Total Marks
                        </p>

                        <h3 className="font-bold text-base">
                            {totalMarks}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex items-start gap-3">

                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                    <MessageSquareText size={18} />
                </div>

                <div>
                    <p className="text-xs text-base-content/60 mb-1">
                        Remarks
                    </p>

                    <h3 className="font-medium text-sm text-base-content leading-relaxed">
                        {remarks?.trim()
                            ? remarks
                            : "N/A"}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default InsightsCard;
