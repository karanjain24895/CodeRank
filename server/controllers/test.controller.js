import Test from "../models/Test.js";
import Submission from "../models/Submission.js";

const normalizeTestQuestions = (test) => {
    const plainTest =
        typeof test.toObject === "function"
            ? test.toObject()
            : test;

    if (plainTest.testType === "mcq") {
        plainTest.questions =
            plainTest.mcqQuestions?.map((question) => ({
                questionNumber: question.questionNumber,
                questionName: question.questionText,
                questionText: question.questionText,
                options: question.options,
                marks: question.marks,
            })) || [];
        plainTest.mcqQuestions = plainTest.questions;

        return plainTest;
    }

    if (!plainTest.questionRefs?.length) {
        return plainTest;
    }

    plainTest.topics =
        plainTest.topicFolderIds
            ?.map((folder) => ({
                _id: folder._id || folder,
                name: folder.name,
            }))
            .filter((folder) => folder.name) || [];

    plainTest.questions =
        plainTest.questionRefs
            .map((ref) => {
                const question =
                    ref.questionId;

                if (!question) return null;

                return {
                    questionNumber:
                        ref.questionNumber,
                    questionName:
                        question.questionName,
                    description:
                        question.description || "",
                    questionLink:
                        question.questionLink,
                    marks:
                        question.marks,
                    questionBankId:
                        question._id,
                    folderId:
                        question.folderId?._id || question.folderId,
                    topicName:
                        question.folderId?.name || "",
                };
            })
            .filter(Boolean);

    return plainTest;
};

const getTestWithQuestionRefs = (query) =>
    query.populate([
        {
            path: "topicFolderIds",
            select: "name",
        },
        {
            path: "questionRefs.questionId",
            select:
                "questionName questionLink description marks folderId",
            populate: {
                path: "folderId",
                select: "name",
            },
        },
    ]);

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
            questionIds,
            topicFolderIds,
        } = req.body;

        // Validation
        if (
            !topicName ||
            !duration ||
            !startDateTime
        ) {

            return res.status(400).json({
                message:
                    "Please fill all required fields",
            });
        }

        if (Array.isArray(questionIds) && questionIds.length) {
            const normalizedQuestionIds =
                questionIds.map((id) => id.toString());

            if (
                new Set(normalizedQuestionIds).size !==
                normalizedQuestionIds.length
            ) {
                return res.status(400).json({
                    message: "Duplicate questions are not allowed",
                });
            }

            const QuestionBank =
                (await import("../models/QuestionBank.js")).default;

            const bankQuestions =
                await QuestionBank.find({
                    _id: { $in: normalizedQuestionIds },
                });

            const questionById = new Map(
                bankQuestions.map((question) => [
                    question._id.toString(),
                    question,
                ])
            );

            const orderedQuestions = normalizedQuestionIds
                .map((id) => questionById.get(id))
                .filter(Boolean);

            if (orderedQuestions.length !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "One or more selected questions were not found",
                });
            }

            const fullMarks =
                orderedQuestions.reduce(
                    (total, question) =>
                        total + Number(question.marks || 0),
                    0
                );

            const folderIds = [
                ...new Set([
                    ...(topicFolderIds || []),
                    ...orderedQuestions.map((question) =>
                        question.folderId.toString()
                    ),
                ]),
            ];

            const test =
                await Test.create({
                    topicName,
                    testName: topicName,
                    sourceType: "manual",
                    instructions,
                    duration: Number(duration),
                    startDateTime,
                    fullMarks,
                    topicFolderIds: folderIds,
                    questionRefs: orderedQuestions.map(
                        (question, index) => ({
                            questionNumber: index + 1,
                            questionId: question._id,
                        })
                    ),
                    questions: [],
                    createdBy: req.user?._id || null,
                });

            return res.status(201).json({
                message: "Test created successfully",
                test,
            });
        }

        if (!questions?.length) {
            return res.status(400).json({
                message: "Please select at least one question",
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

        const filter = req.user?.isAdmin
            ? {}
            : {
                $or: [
                    { sourceType: "manual" },
                    { sourceType: { $exists: false } },
                    { generatedFor: req.user?._id },
                ],
            };

        const tests = await getTestWithQuestionRefs(Test.find(filter))
            .sort({
                createdAt: -1,
            });

        res.status(200).json(
            tests.map(normalizeTestQuestions)
        );

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

        const test = await getTestWithQuestionRefs(
            Test.findById(req.params.id)
        );

        if (!test) {

            return res.status(404).json({
                message: "Test not found",
            });
        }

        res.status(200).json(
            normalizeTestQuestions(test)
        );

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
            questionIds,
            topicFolderIds,
        } = req.body;

        if (Array.isArray(questionIds) && questionIds.length) {
            const normalizedQuestionIds =
                questionIds.map((id) => id.toString());

            if (
                new Set(normalizedQuestionIds).size !==
                normalizedQuestionIds.length
            ) {
                return res.status(400).json({
                    message: "Duplicate questions are not allowed",
                });
            }

            const QuestionBank =
                (await import("../models/QuestionBank.js")).default;

            const bankQuestions =
                await QuestionBank.find({
                    _id: { $in: normalizedQuestionIds },
                });

            const questionById = new Map(
                bankQuestions.map((question) => [
                    question._id.toString(),
                    question,
                ])
            );

            const orderedQuestions = normalizedQuestionIds
                .map((id) => questionById.get(id))
                .filter(Boolean);

            if (orderedQuestions.length !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "One or more selected questions were not found",
                });
            }

            const fullMarks =
                orderedQuestions.reduce(
                    (total, question) =>
                        total + Number(question.marks || 0),
                    0
                );

            const folderIds = [
                ...new Set([
                    ...(topicFolderIds || []),
                    ...orderedQuestions.map((question) =>
                        question.folderId.toString()
                    ),
                ]),
            ];

            const updatedTest =
                await Test.findByIdAndUpdate(
                    req.params.id,
                    {
                        topicName,
                        testName: topicName,
                        sourceType: "manual",
                        instructions,
                        fullMarks,
                        duration: Number(duration),
                        startDateTime,
                        topicFolderIds: folderIds,
                        questionRefs: orderedQuestions.map(
                            (question, index) => ({
                                questionNumber: index + 1,
                                questionId: question._id,
                            })
                        ),
                        questions: [],
                    },
                    {
                        new: true,
                    }
                );

            return res.status(200).json(updatedTest);
        }

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
