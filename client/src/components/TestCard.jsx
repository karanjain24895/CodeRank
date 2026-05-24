import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Clock3,
    Trophy,
    CalendarDays,
    BookOpen,
} from "lucide-react";

const TestCard = ({
    testId,
    topicName,
    fullMarks,
    duration,
    questionsCount,
    liveDateTime,
}) => {

    const [countdown, setCountdown] = useState("");
    const [isLive, setIsLive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const updateCountdown = () => {

            const now = Date.now();

            // Convert to IST
            const testTime =
                new Date(liveDateTime).getTime() -
                (5.5 * 60 * 60 * 1000);

            const distance = testTime - now;

            // Test is Live
            if (distance <= 0) {

                setIsLive(true);

                setCountdown("Live Now");

                return;
            }

            setIsLive(false);

            // Time Calculations
            const days = Math.floor(
                distance / (1000 * 60 * 60 * 24)
            );

            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );

            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) /
                (1000 * 60)
            );

            const seconds = Math.floor(
                (distance % (1000 * 60)) / 1000
            );

            setCountdown(
                `${days}d ${hours}h ${minutes}m ${seconds}s`
            );
        };

        // Run immediately
        updateCountdown();

        // Update every second
        const interval =
            setInterval(updateCountdown, 1000);

        return () =>
            clearInterval(interval);

    }, [liveDateTime]);

    return (

        <div className="w-full bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">

                {/* Topic */}
                <div>

                    <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                        {topicName}
                    </h2>

                </div>

                {/* Right Side */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">

                    {/* Countdown */}
                    <div
                        className={`badge px-4 py-3 font-medium text-xs sm:text-sm ${
                            isLive
                                ? "badge-success"
                                : "badge-secondary"
                        }`}
                    >

                        {isLive
                            ? "Test is Live 🚀"
                            : `Starts In ${countdown}`}

                    </div>

                    {/* Start Test Button */}
                    <button
                        onClick={() =>
                            isLive &&
                            navigate(`/test/${testId}`)
                        }

                        className={`btn rounded-xl px-4 h-10 min-h-0 text-sm shadow-sm transition-all duration-300 ${
                            isLive
                                ? "btn-primary hover:scale-[1.01]"
                                : "btn-disabled"
                        }`}
                    >

                        {isLive
                            ? "Start Test"
                            : "Test Not Live"}

                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

                {/* Full Marks */}
                <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">

                        <Trophy size={18} />

                    </div>

                    <div>

                        <p className="text-xs text-base-content/60">
                            Full Marks
                        </p>

                        <h3 className="font-bold text-base">
                            {fullMarks}
                        </h3>

                    </div>
                </div>

                {/* Duration */}
                <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">

                        <Clock3 size={18} />

                    </div>

                    <div>

                        <p className="text-xs text-base-content/60">
                            Duration
                        </p>

                        <h3 className="font-bold text-base">
                            {duration} Hours
                        </h3>

                    </div>
                </div>

                {/* Questions */}
                <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">

                        <BookOpen size={18} />

                    </div>

                    <div>

                        <p className="text-xs text-base-content/60">
                            Questions
                        </p>

                        <h3 className="font-bold text-base">
                            {questionsCount}
                        </h3>

                    </div>
                </div>

                {/* Live Time */}
                <div className="bg-base-200 rounded-xl p-3 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">

                        <CalendarDays size={18} />

                    </div>

                    <div>

                        <p className="text-xs text-base-content/60">
                            Goes Live
                        </p>

                        <h3 className="font-bold text-sm">

                            {new Date(
                                new Date(liveDateTime).getTime() -
                                (5.5 * 60 * 60 * 1000)
                            )
                                .toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })
                                .replace("am", "AM")
                                .replace("pm", "PM")}

                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCard;