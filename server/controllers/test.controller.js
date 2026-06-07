import Test from "../models/Test.js";
import Submission from "../models/Submission.js";

export const createTest = async (
    req,
    res
) => {

    try {

        const {
            topicName,
            instructions,
            duration,
            startDateTime,
            questions,
        } = req.body;

        // Validation
        if (
            !topicName ||
            !duration ||
            !startDateTime ||
            !questions?.length
        ) {

            return res.status(400).json({
                message:
                    "Please fill all required fields",
            });
        }

        // Dynamic Full Marks
        const fullMarks =
            questions.reduce(
                (
                    total,
                    question
                ) => {

                    return (
                        total +
                        Number(
                            question.marks || 0
                        )
                    );
                },
                0
            );

        // Add Question Numbers
        const formattedQuestions =
            questions.map(
                (
                    question,
                    index
                ) => ({
                    questionNumber:
                        index + 1,

                    questionName:
                        question.questionName,

                    description:
                        question.description || "",

                    questionLink:
                        question.questionLink,

                    marks:
                        Number(
                            question.marks
                        ),
                })
            );

        const test =
            await Test.create({

                topicName,

                instructions,

                duration:
                    Number(duration),

                startDateTime,

                fullMarks,

                questions:
                    formattedQuestions,

                // Safe fallback
                createdBy:
                    req.user?._id || null,
            });

        res.status(201).json({
            message:
                "Test created successfully",

            test,
        });

    } catch (error) {

        console.log(
            "Create Test Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create test",

            error:
                error.message,
        });
    }
};
export const getAllTests = async (
    req,
    res
) => {

    try {

        const tests = await Test.find()
            .sort({
                createdAt: -1,
            });

        res.status(200).json(tests);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

export const getSingleTest = async (
    req,
    res
) => {

    try {

        const test = await Test.findById(
            req.params.id
        );

        if (!test) {

            return res.status(404).json({
                message: "Test not found",
            });
        }

        res.status(200).json(test);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateTest = async (
    req,
    res
) => {

    try {

        const {
            topicName,
            instructions,
            duration,
            startDateTime,
            questions,
        } = req.body;

        const fullMarks = questions.reduce(
            (total, question) => {
                return (
                    total +
                    Number(question.marks)
                );
            },
            0
        );

        const formattedQuestions =
            questions.map(
                (
                    question,
                    index
                ) => ({
                    questionNumber:
                        index + 1,

                    questionName:
                        question.questionName,

                    description:
                        question.description || "",

                    questionLink:
                        question.questionLink,

                    marks:
                        Number(
                            question.marks
                        ),
                })
            );

        const updatedTest =
            await Test.findByIdAndUpdate(
                req.params.id,
                {
                    topicName,
                    instructions,
                    fullMarks,
                    duration,
                    startDateTime,
                    questions:
                        formattedQuestions,
                },
                {
                    new: true,
                }
            );

        res.status(200).json(updatedTest);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Test
export const deleteTest =
    async (req, res) => {

        try {

            const {
                testId,
            } = req.params;

            // Delete related submissions
            await Submission.deleteMany({
                test: testId,
            });

            // Delete test
            const deletedTest =
                await Test.findByIdAndDelete(
                    testId
                );

            if (!deletedTest) {

                return res.status(404).json({
                    message:
                        "Test not found",
                });
            }

            res.status(200).json({
                message:
                    "Test and related submissions deleted successfully",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    "Internal server error",
                error:
                    error.message,
            });
        }
    };