import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axiosInstance from "../lib/axios";

import {
  Plus,
  Trash2,
  FileText,
  Clock3,
  CalendarClock,
  Link2,
  Trophy,
  CheckCircle2,
  Tags,
} from "lucide-react";

const TestForm = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] =
    useState(false);

  const [topicName, setTopicName] =
    useState("");

  const [instructions, setInstructions] =
    useState([
      "Using headphones is not allowed",
      "Write the most optimal code otherwise partial marks will be given",
      "Marks will be awarded based on marks in Code Studio platform",
      "Write the Time Complexity and Space Complexity at the end in comments. It contains 6+4 marks respectively",
    ]);

  const [duration, setDuration] =
    useState("");

  const [startDateTime,
    setStartDateTime] = useState("");

  const [questions, setQuestions] =
    useState([
      {
        questionName: "",
        questionLink: "",
        description: "",
        marks: "",
      },
    ]);

  const [folders, setFolders] =
    useState([]);

  const [selectedFolderId, setSelectedFolderId] =
    useState("");

  const [folderQuestions, setFolderQuestions] =
    useState([]);

  const [selectedQuestions, setSelectedQuestions] =
    useState([]);

  const [loadingQuestions, setLoadingQuestions] =
    useState(false);

  const [legacyQuestionMode, setLegacyQuestionMode] =
    useState(false);

  // Prevent accidental back / refresh
  useEffect(() => {

    const handleBeforeUnload = (
      e
    ) => {

      e.preventDefault();

      e.returnValue = "";
    };

    const handlePopState = () => {

      const confirmLeave =
        window.confirm(
          "Do you want to go back? Unsaved changes may be lost."
        );

      if (!confirmLeave) {

        window.history.pushState(
          null,
          "",
          window.location.href
        );
      } else {

        navigate(-1);
      }
    };

    // Push history state
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };

  }, [navigate]);

  useEffect(() => {

    const fetchFolders = async () => {

      try {

        const res =
          await axiosInstance.get(
            "/question-folders"
          );

        setFolders(
          res.data.folders || []
        );

      } catch (error) {

        console.log(error);
      }
    };

    fetchFolders();

  }, []);

  useEffect(() => {

    if (!selectedFolderId) {

      setFolderQuestions([]);
      return;
    }

    const fetchFolderQuestions = async () => {

      try {

        setLoadingQuestions(true);

        const res =
          await axiosInstance.get(
            `/question-bank/folder/${selectedFolderId}`
          );

        setFolderQuestions(
          res.data.questions || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingQuestions(false);
      }
    };

    fetchFolderQuestions();

  }, [selectedFolderId]);

  // Fetch Existing Test
  useEffect(() => {

    if (!isEdit) return;

    const fetchTest = async () => {

      try {

        setLoading(true);

        const res =
          await axiosInstance.get(
            `/test/${id}`,
            {
              headers: {
                "x-admin-key":
                  "mysecretadminkey",
              },
            }
          );

        const test = res.data;

        setTopicName(
          test.topicName
        );

        setInstructions(
          test.instructions
        );

        setDuration(
          test.duration
        );

        setStartDateTime(
          test.startDateTime.slice(
            0,
            16
          )
        );

        const hasBankQuestions =
          test.questions?.some(
            (question) =>
              question.questionBankId
          );

        setLegacyQuestionMode(
          isEdit && !hasBankQuestions
        );

        if (hasBankQuestions) {

          setSelectedQuestions(
            test.questions.map((question) => ({
              _id:
                question.questionBankId,
              folderId:
                question.folderId,
              questionName:
                question.questionName,
              questionLink:
                question.questionLink,
              description:
                question.description || "",
              marks:
                question.marks,
            }))
          );

          setSelectedFolderId(
            test.questions[0]?.folderId ||
            test.topicFolderIds?.[0]?._id ||
            ""
          );

        } else {

          setQuestions(
            test.questions
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchTest();

  }, [id, isEdit]);

  // Dynamic Full Marks
  const activeQuestions =
    legacyQuestionMode
      ? questions
      : selectedQuestions;

  const fullMarks = activeQuestions.reduce(
    (total, q) => {
      return (
        total +
        Number(q.marks || 0)
      );
    },
    0
  );

  const selectedQuestionIds =
    selectedQuestions.map(
      (question) => question._id
    );

  const selectedQuestionIdSet =
    new Set(selectedQuestionIds);

  const toggleQuestionSelection = (
    question
  ) => {

    setSelectedQuestions((prev) => {

      const exists =
        prev.some(
          (item) =>
            item._id === question._id
        );

      if (exists) {

        return prev.filter(
          (item) =>
            item._id !== question._id
        );
      }

      return [
        ...prev,
        question,
      ];
    });
  };

  const removeSelectedQuestion = (
    questionId
  ) => {

    setSelectedQuestions((prev) =>
      prev.filter(
        (question) =>
          question._id !== questionId
      )
    );
  };

  // Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionName: "",
        questionLink: "",
        description: "",
        marks: "",
      },
    ]);
  };

  // Remove Question
  const removeQuestion = (
    index
  ) => {

    const updatedQuestions = [
      ...questions,
    ];

    updatedQuestions.splice(
      index,
      1
    );

    setQuestions(
      updatedQuestions
    );
  };

  // Update Question
  const handleQuestionChange = (
    index,
    field,
    value
  ) => {

    const updatedQuestions = [
      ...questions,
    ];

    updatedQuestions[index][field] =
      value;

    setQuestions(
      updatedQuestions
    );
  };

  // Add Instruction
  const addInstruction = () => {

    setInstructions([
      ...instructions,
      "",
    ]);
  };

  // Update Instruction
  const updateInstruction = (
    index,
    value
  ) => {

    const updatedInstructions = [
      ...instructions,
    ];

    updatedInstructions[index] =
      value;

    setInstructions(
      updatedInstructions
    );
  };

  // Remove Instruction
  const removeInstruction = (
    index
  ) => {

    const updatedInstructions = [
      ...instructions,
    ];

    updatedInstructions.splice(
      index,
      1
    );

    setInstructions(
      updatedInstructions
    );
  };

  // Submit
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      const selectedTopicFolderIds = [
        ...new Set(
          selectedQuestions
            .map((question) =>
              question.folderId?._id ||
              question.folderId
            )
            .filter(Boolean)
        ),
      ];

      const testData =
        legacyQuestionMode
          ? {
              topicName,
              instructions,
              duration:
                Number(duration),
              startDateTime,
              questions:
                questions.map((q) => ({
                  ...q,
                  marks:
                    Number(q.marks),
                })),
            }
          : {
              topicName,
              instructions,
              duration:
                Number(duration),
              startDateTime,
              questionIds:
                selectedQuestionIds,
              topicFolderIds:
                selectedTopicFolderIds,
            };

      if (isEdit) {

        await axiosInstance.put(
          `/test/${id}`,
          testData,
          {
            headers: {
              "x-admin-key":
                "mysecretadminkey",
            },
          }
        );

      } else {

        await axiosInstance.post(
          "/test/create",
          testData,
          {
            headers: {
              "x-admin-key":
                "mysecretadminkey",
            },
          }
        );
      }

      navigate(
        "/created-tests"
      );

    } catch (error) {

      console.log(error);
    }
  };

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

          {isEdit
            ? "Edit Test"
            : "Create Test"}

        </h1>

        <p className="text-base-content/70 mt-3 text-lg">

          {isEdit
            ? "Modify and manage your coding test ✨"
            : "Create and schedule a coding test 🚀"}

        </p>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Test Details */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-md">

          <h2 className="text-3xl font-bold mb-8">
            Test Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Topic Name */}
            <div>

              <label className="label">
                <span className="label-text font-medium">
                  Topic Name
                </span>
              </label>

              <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                <FileText size={20} />

                <input
                  type="text"
                  placeholder="Enter topic name"
                  className="grow"
                  value={topicName}
                  onChange={(e) =>
                    setTopicName(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

            {/* Full Marks */}
            <div>

              <label className="label">
                <span className="label-text font-medium">
                  Full Marks
                </span>
              </label>

              <div className="bg-base-200 rounded-2xl h-14 px-5 flex items-center gap-3 text-lg font-bold">

                <Trophy
                  size={20}
                  className="text-primary"
                />

                {fullMarks}

              </div>

            </div>

            {/* Duration */}
            <div>

              <label className="label">
                <span className="label-text font-medium">
                  Duration (in Hours)
                </span>
              </label>

              <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                <Clock3 size={20} />

                <input
                  type="text"
                  placeholder="e.g. 3"
                  className="grow"
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

            {/* Start Date Time */}
            <div>

              <label className="label">
                <span className="label-text font-medium">
                  Start Date & Time
                </span>
              </label>

              <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                <CalendarClock
                  size={20}
                />

                <input
                  type="datetime-local"
                  className="grow"
                  value={startDateTime}
                  onChange={(e) =>
                    setStartDateTime(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

          </div>

        </div>

        {/* Instructions */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-md">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold">
              Instructions
            </h2>

            <button
              type="button"
              onClick={
                addInstruction
              }
              className="btn btn-primary rounded-2xl"
            >

              <Plus size={20} />

              Add

            </button>

          </div>

          <div className="space-y-4">

            {instructions.map(
              (
                instruction,
                index
              ) => (

                <div
                  key={index}
                  className="flex gap-3"
                >

                  <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

                    <input
                      type="text"
                      className="grow"
                      placeholder={`Instruction ${index + 1}`}
                      value={instruction}
                      onChange={(e) =>
                        updateInstruction(
                          index,
                          e.target.value
                        )
                      }
                    />

                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      removeInstruction(
                        index
                      )
                    }
                    className="btn btn-error btn-square rounded-2xl"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              )
            )}

          </div>

        </div>

        {/* Questions */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-md">

          <div className="mb-8 text-center">

            <h2 className="text-3xl font-bold">
              Questions
            </h2>

            {!legacyQuestionMode && (
              <p className="text-base-content/60 mt-2">
                Select a topic, then choose questions from Question Bank.
              </p>
            )}
          </div>

          {legacyQuestionMode ? (
            <>
              <div className="alert alert-warning mb-6">
                This older test stores embedded questions. It can still be edited here, but new tests use Question Bank questions.
              </div>

              <div className="space-y-6">

                {questions.map(
                  (
                    question,
                    index
                  ) => (

                    <div
                      key={index}
                      className="bg-base-200 rounded-3xl p-6 border border-base-300"
                    >

                      <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                            {index + 1}
                          </div>

                          <div>

                            <h3 className="text-2xl font-bold">
                              Question {index + 1}
                            </h3>

                            <p className="text-base-content/60">
                              Legacy question details
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeQuestion(
                              index
                            )
                          }
                          className="btn btn-error btn-square rounded-2xl"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                          <FileText size={20} />

                          <input
                            type="text"
                            placeholder="Question Name"
                            className="grow"
                            value={
                              question.questionName
                            }
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "questionName",
                                e.target.value
                              )
                            }
                          />

                        </label>

                        <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                          <Link2 size={20} />

                          <input
                            type="url"
                            placeholder="Question Link"
                            className="grow"
                            value={
                              question.questionLink
                            }
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "questionLink",
                                e.target.value
                              )
                            }
                          />

                        </label>

                        <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14">

                          <Trophy size={20} />

                          <input
                            type="text"
                            placeholder="Marks"
                            className="grow"
                            value={
                              question.marks
                            }
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "marks",
                                e.target.value
                              )
                            }
                          />

                        </label>

                        <div className="md:col-span-3">
                          <textarea
                            placeholder="Question Description"
                            className="textarea textarea-bordered w-full rounded-2xl min-h-32"
                            value={question.description || ""}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="flex justify-center mt-8">

                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn btn-primary rounded-2xl px-8 h-14 text-lg"
                >

                  <Plus size={20} />

                  Add Question

                </button>

              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

              <div className="xl:col-span-5 space-y-4">

                <label className="form-control">
                  <span className="label-text font-medium mb-2">
                    Topic
                  </span>

                  <select
                    className="select select-bordered rounded-2xl h-14"
                    value={selectedFolderId}
                    onChange={(e) =>
                      setSelectedFolderId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select topic
                    </option>

                    {folders.map((folder) => (
                      <option
                        key={folder._id}
                        value={folder._id}
                      >
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="bg-base-200 rounded-3xl border border-base-300 min-h-96 overflow-hidden">
                  <div className="px-5 py-4 border-b border-base-300 flex items-center gap-2">
                    <Tags size={18} />
                    <h3 className="font-bold">
                      Available Questions
                    </h3>
                  </div>

                  <div className="p-4 max-h-[28rem] overflow-y-auto space-y-3">
                    {!selectedFolderId ? (
                      <div className="text-center text-base-content/60 py-16">
                        Select a topic to view questions.
                      </div>
                    ) : loadingQuestions ? (
                      <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : folderQuestions.length === 0 ? (
                      <div className="text-center text-base-content/60 py-16">
                        No questions found in this topic.
                      </div>
                    ) : (
                      folderQuestions.map((question) => {
                        const isSelected =
                          selectedQuestionIdSet.has(
                            question._id
                          );

                        return (
                          <button
                            type="button"
                            key={question._id}
                            onClick={() =>
                              toggleQuestionSelection(
                                question
                              )
                            }
                            className={`w-full text-left rounded-2xl border p-4 transition ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-base-300 bg-base-100 hover:border-primary"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h4 className="font-bold truncate">
                                  {question.questionName}
                                </h4>

                                <p className="text-xs text-base-content/60 mt-1">
                                  {question.marks} marks
                                </p>
                              </div>

                              {isSelected && (
                                <CheckCircle2
                                  size={20}
                                  className="text-primary shrink-0"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-7 bg-base-200 rounded-3xl border border-base-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-base-300 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold">
                      Selected Questions
                    </h3>

                    <p className="text-xs text-base-content/60 mt-1">
                      {selectedQuestions.length} selected
                    </p>
                  </div>

                  <div className="badge badge-primary rounded-xl px-4 py-3">
                    {fullMarks} marks
                  </div>
                </div>

                <div className="p-4 max-h-[34rem] overflow-y-auto space-y-3">
                  {selectedQuestions.length === 0 ? (
                    <div className="text-center text-base-content/60 py-20">
                      Selected questions will appear here.
                    </div>
                  ) : (
                    selectedQuestions.map(
                      (question, index) => (
                        <div
                          key={question._id}
                          className="bg-base-100 border border-base-300 rounded-2xl p-4 flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold truncate">
                              {question.questionName}
                            </h4>

                            <p className="text-xs text-base-content/60 mt-1">
                              {question.marks} marks
                            </p>
                          </div>

                          <button
                            type="button"
                            className="btn btn-error btn-sm btn-square rounded-xl"
                            onClick={() =>
                              removeSelectedQuestion(
                                question._id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Submit */}
        <div className="flex justify-end">

          <button
            type="submit"
            className="btn btn-primary rounded-2xl px-10 h-14 text-lg"
          >

            {isEdit
              ? "Update Test"
              : "Create Test"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default TestForm;
