import React, {
    useEffect,
    useState,
} from "react";

import TestCard from "../../components/TestCard";

import axiosInstance from "../../lib/axios";

const NewTests = () => {

    const [tests, setTests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    // Fetch Tests
    const fetchTests = async () => {

        try {

            setLoading(true);

            // Fetch all tests
            const testsRes =
                await axiosInstance.get(
                    "/test/all"
                );

            // Fetch user submissions
            const submissionsRes =
                await axiosInstance.get(
                    "/submissions/me"
                );

            const allTests =
                testsRes.data;

            const submissions =
                submissionsRes.data;

            // Get submitted test ids
            const attemptedTestIds =
                submissions.map(
                    (
                        submission
                    ) =>
                        submission.test?._id
                );

            // Filter unattempted tests
            const filteredTests =
                allTests.filter(
                    (
                        test
                    ) =>
                        !attemptedTestIds.includes(
                            test._id
                        )
                );

            setTests(
                filteredTests
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchTests();

    }, []);

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <span className="loading loading-spinner loading-lg"></span>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

            {/* Header */}
            <div className="mb-10">

                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    New Tests
                </h1>

                <p className="text-base-content/70 mt-3 text-lg">
                    Attempt upcoming coding tests 🚀
                </p>
            </div>

            {/* Test Cards */}
            <div className="space-y-6">

                {tests.length > 0 ? (

                    tests.map((test, index) => (

                        <TestCard
                            key={test._id}
                            testId={test._id}
                            testNumber={index + 1}
                            topicName={test.topicName}
                            fullMarks={test.fullMarks}
                            duration={test.duration}
                            questionsCount={
                                test.questions.length
                            }
                            liveDateTime={
                                test.startDateTime
                            }
                        />
                    ))

                ) : (

                    <div className="bg-base-100 border border-base-300 rounded-3xl p-10 text-center shadow-md">

                        <h2 className="text-2xl font-bold">
                            No New Tests
                        </h2>

                        <p className="text-base-content/60 mt-2">
                            All available tests are already attempted 🎉
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewTests;