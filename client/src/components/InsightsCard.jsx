import React from "react";
import {
    Code2,
    Timer,
    Database,
    Trophy,
    MessageSquareText,
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
}) => {

    return (
        <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                {/* Left Side */}
                <div className="flex items-center gap-4">

                    {/* Question Number */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shrink-0">
                        {questionNumber}
                    </div>

                    {/* Question Name */}
                    <div>

                        <h2 className="text-2xl font-bold text-base-content">
                            {questionName}
                        </h2>

                    </div>
                </div>

                {/* View Question Button */}
                <button onClick={() =>
                    window.open(
                        questionLink,
                        "_blank"
                    )
                }
                    className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-2xl px-5 py-4 transition-all duration-300 flex items-center gap-3 border border-base-300"
                >

                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Code2 size={20} />
                    </div>

                    <div className="text-left">
                        {/* <p className="text-sm opacity-70">
                            Open
                        </p> */}

                        <h3 className="font-bold">
                            View Question
                        </h3>
                    </div>
                </button>
            </div>
            {/* Middle Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

                {/* Coding Marks */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Code2 size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Coding Marks
                        </p>

                        <h3 className="font-bold text-lg">
                            {codingMarks}
                        </h3>
                    </div>
                </div>

                {/* Time Complexity */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <Timer size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Time Complexity
                        </p>

                        <h3 className="font-bold text-lg">
                            {timeComplexityMarks}
                        </h3>
                    </div>
                </div>

                {/* Space Complexity */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <Database size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Space Complexity
                        </p>

                        <h3 className="font-bold text-lg">
                            {spaceComplexityMarks}
                        </h3>
                    </div>
                </div>

                {/* Total Marks */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                        <Trophy size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Total Marks
                        </p>

                        <h3 className="font-bold text-lg">
                            {totalMarks}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bg-base-200 rounded-2xl p-5 flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning shrink-0">
                    <MessageSquareText size={22} />
                </div>

                <div>
                    <p className="text-sm text-base-content/60 mb-1">
                        Remarks
                    </p>

                    <h3 className="font-medium text-base-content">
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