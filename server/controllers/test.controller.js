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
        if (plainTest.subject) {
            plainTest.topics = [{ name: plainTest.subject }];
        } else {
            plainTest.topics = [];
        }

        return plainTest;
    }

    if (plainTest.testType === "interview") {
        plainTest.questions = plainTest.questions || [];
        plainTest.topics = plainTest.topics || [];
        return plainTest;
    }

    if (!plainTest.questionRefs?.length) {
        plainTest.questions = plainTest.questions || [];
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
                const question = ref.questionId;

                if (!question) return null;

                return {
                    questionNumber: ref.questionNumber,
                    questionName: question.questionName,
                    description: question.description || "",
                    questionLink: question.questionLink,
                    marks: question.marks,
                    questionBankId: question._id,
                    folderId: question.folderId?._id || question.folderId,
                    topicName: question.folderId?.name || "",
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
            select: "questionName questionLink description marks folderId",
            populate: {
                path: "folderId",
                select: "name",
            },
        },
    ]);

// ─── Create Test ──────────────────────────────────────────────────────────────
export const createTest = async (req, res) => {
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
        if (!topicName || !duration || !startDateTime) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        if (Array.isArray(questionIds) && questionIds.length) {
            const normalizedQuestionIds = questionIds.map((id) => id.toString());

            if (new Set(normalizedQuestionIds).size !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "Duplicate questions are not allowed",
                });
            }

            const QuestionBank = (await import("../models/QuestionBank.js")).default;

            const bankQuestions = await QuestionBank.find({
                _id: { $in: normalizedQuestionIds },
            });

            const questionById = new Map(
                bankQuestions.map((question) => [question._id.toString(), question])
            );

            const orderedQuestions = normalizedQuestionIds
                .map((id) => questionById.get(id))
                .filter(Boolean);

            if (orderedQuestions.length !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "One or more selected questions were not found",
                });
            }

            const fullMarks = orderedQuestions.reduce(
                (total, question) => total + Number(question.marks || 0),
                0
            );

            const folderIds = [
                ...new Set([
                    ...(topicFolderIds || []),
                    ...orderedQuestions.map((question) => question.folderId.toString()),
                ]),
            ];

            const test = await Test.create({
                topicName,
                testName: topicName,
                sourceType: "manual",
                instructions,
                duration: Number(duration),
                startDateTime,
                fullMarks,
                topicFolderIds: folderIds,
                questionRefs: orderedQuestions.map((question, index) => ({
                    questionNumber: index + 1,
                    questionId: question._id,
                })),
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

        const fullMarks = questions.reduce(
            (total, question) => total + Number(question.marks || 0),
            0
        );

        const formattedQuestions = questions.map((question, index) => ({
            questionNumber: index + 1,
            questionName: question.questionName,
            description: question.description || "",
            questionLink: question.questionLink,
            marks: Number(question.marks),
        }));

        const test = await Test.create({
            topicName,
            instructions,
            duration: Number(duration),
            startDateTime,
            fullMarks,
            questions: formattedQuestions,
            createdBy: req.user?._id || null,
        });

        res.status(201).json({
            message: "Test created successfully",
            test,
        });

    } catch (error) {
        console.log("Create Test Error:", error);
        res.status(500).json({
            message: "Failed to create test",
            error: error.message,
        });
    }
};

export const getAllTests = async (req, res) => {
    try {
        // ── Pagination ─────────────────────────────────────────────────────
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip  = (page - 1) * limit;

        // ── Sort ───────────────────────────────────────────────────────────
        // always latest first (startDateTime DESC)
        const sortOrder = { startDateTime: -1 };

        // ── Retrieve User's Attempted Test IDs ─────────────────────────────
        let attemptedTestIds = [];
        if (req.user) {
            const submissions = await Submission.find({
                user: req.user._id,
                isFinished: true,
            }).select("test");
            attemptedTestIds = submissions.map((s) => s.test).filter(Boolean);
        }

        // ── Base Filter ────────────────────────────────────────────────────
        const baseFilter = req.user?.isAdmin
            ? {}
            : {
                $or: [
                    { sourceType: "manual" },
                    { sourceType: { $exists: false } },
                    { generatedFor: req.user?._id },
                ],
            };

        // ── Apply Filter Mode ──────────────────────────────────────────────
        const filterMode = req.query.filterMode || "all";
        const targetDate = new Date(Date.now() + 5.5 * 3600 * 1000);
        let filter = { ...baseFilter };

        if (filterMode === "attempted") {
            filter._id = { $in: attemptedTestIds };
        } else if (filterMode === "live") {
            filter._id = { $nin: attemptedTestIds };
            filter.startDateTime = { $lte: targetDate };
        } else if (filterMode === "upcoming") {
            filter._id = { $nin: attemptedTestIds };
            filter.startDateTime = { $gt: targetDate };
        } else {
            // "all" -> everything (do not filter out attempted tests)
        }

        // Count + fetch in parallel
        const [totalCount, tests] = await Promise.all([
            Test.countDocuments(filter),
            getTestWithQuestionRefs(
                Test.find(filter).sort(sortOrder).skip(skip).limit(limit)
            ),
        ]);

        res.status(200).json({
            tests: tests.map(normalizeTestQuestions),
            totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
            limit,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Get Single Test ──────────────────────────────────────────────────────────
export const getSingleTest = async (req, res) => {
    try {
        const test = await getTestWithQuestionRefs(Test.findById(req.params.id));

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.status(200).json(normalizeTestQuestions(test));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Update Test ──────────────────────────────────────────────────────────────
export const updateTest = async (req, res) => {
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
            const normalizedQuestionIds = questionIds.map((id) => id.toString());

            if (new Set(normalizedQuestionIds).size !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "Duplicate questions are not allowed",
                });
            }

            const QuestionBank = (await import("../models/QuestionBank.js")).default;

            const bankQuestions = await QuestionBank.find({
                _id: { $in: normalizedQuestionIds },
            });

            const questionById = new Map(
                bankQuestions.map((question) => [question._id.toString(), question])
            );

            const orderedQuestions = normalizedQuestionIds
                .map((id) => questionById.get(id))
                .filter(Boolean);

            if (orderedQuestions.length !== normalizedQuestionIds.length) {
                return res.status(400).json({
                    message: "One or more selected questions were not found",
                });
            }

            const fullMarks = orderedQuestions.reduce(
                (total, question) => total + Number(question.marks || 0),
                0
            );

            const folderIds = [
                ...new Set([
                    ...(topicFolderIds || []),
                    ...orderedQuestions.map((question) => question.folderId.toString()),
                ]),
            ];

            const updatedTest = await Test.findByIdAndUpdate(
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
                    questionRefs: orderedQuestions.map((question, index) => ({
                        questionNumber: index + 1,
                        questionId: question._id,
                    })),
                    questions: [],
                },
                { new: true }
            );

            return res.status(200).json(updatedTest);
        }

        const fullMarks = questions.reduce(
            (total, question) => total + Number(question.marks),
            0
        );

        const formattedQuestions = questions.map((question, index) => ({
            questionNumber: index + 1,
            questionName: question.questionName,
            description: question.description || "",
            questionLink: question.questionLink,
            marks: Number(question.marks),
        }));

        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            {
                topicName,
                instructions,
                fullMarks,
                duration,
                startDateTime,
                questions: formattedQuestions,
            },
            { new: true }
        );

        res.status(200).json(updatedTest);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Delete Test ──────────────────────────────────────────────────────────────
export const deleteTest = async (req, res) => {
    try {
        const { testId } = req.params;

        // Delete related submissions
        await Submission.deleteMany({ test: testId });

        // Delete test
        const deletedTest = await Test.findByIdAndDelete(testId);

        if (!deletedTest) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.status(200).json({
            message: "Test and related submissions deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
