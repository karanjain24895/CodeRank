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

            const testTime = new Date(liveDateTime).getTime();

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
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);

    }, [liveDateTime]);

    return (
        <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                {/* Topic */}
                <div>
                    <h2 className="text-3xl font-bold text-base-content">
                        {topicName}
                    </h2>

                    {/* <p className="text-base-content/60 mt-1">
                        Coding Test
                    </p> */}
                </div>

                {/* Right Side */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

                    {/* Countdown */}
                    <div
                        className={`badge badge-lg px-5 py-4 font-semibold text-sm ${isLive
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
                        className={`btn rounded-2xl px-6 shadow-lg transition-all duration-300 ${isLive
                                ? "btn-primary hover:scale-[1.03]"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Full Marks */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Trophy size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Full Marks
                        </p>

                        <h3 className="font-bold text-lg">
                            {fullMarks}
                        </h3>
                    </div>
                </div>

                {/* Duration */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <Clock3 size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Duration
                        </p>

                        <h3 className="font-bold text-lg">
                            {duration} Hours
                        </h3>
                    </div>
                </div>

                {/* Questions */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <BookOpen size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Questions
                        </p>

                        <h3 className="font-bold text-lg">
                            {questionsCount}
                        </h3>
                    </div>
                </div>

                {/* Live Time */}
                <div className="bg-base-200 rounded-2xl p-4 flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                        <CalendarDays size={22} />
                    </div>

                    <div>
                        <p className="text-sm text-base-content/60">
                            Goes Live
                        </p>

                        <h3 className="font-bold text-lg">
                            {new Date(liveDateTime)
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