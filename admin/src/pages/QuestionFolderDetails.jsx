import React, {
  useEffect,
  useState,
} from "react";

import { Plus } from "lucide-react";

import {
  useParams,
} from "react-router-dom";

import axiosInstance from "../lib/axios";
import StoredQuestionsCard from "../components/StoredQuestionsCard";
import useConfirmStore from "../store/useConfirmStore";

const QuestionFolderDetails = () => {
  const { folderId } =
    useParams();
  const showConfirm = useConfirmStore((state) => state.showConfirm);

  const [questions,
    setQuestions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [showModal,
    setShowModal] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      questionName: "",
      questionLink: "",
      description: "",
      marks: "",
    });
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            `/question-bank/folder/${folderId}`
          );

        setQuestions(
          res.data.questions || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchQuestions();
  }, [folderId]);

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

const saveQuestion =
  async () => {
    try {
      if (
        editingQuestion
      ) {
        await axiosInstance.put(
          `/question-bank/${editingQuestion._id}`,
          {
            ...formData,
            marks:
              Number(
                formData.marks
              ),
          }
        );
      } else {
        await axiosInstance.post(
          "/question-bank",
          {
            folderId,
            ...formData,
            marks:
              Number(
                formData.marks
              ),
          }
        );
      }

      setFormData({
        questionName: "",
        questionLink: "",
        description: "",
        marks: "",
      });

      setEditingQuestion(
        null
      );

      setShowModal(false);

      fetchQuestions();
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data
          ?.message ||
          "Failed to save question"
      );
    }
  };
  const deleteQuestion =
    async (id) => {
      const confirmed = await showConfirm("Delete this question?");
      if (!confirmed) return;

      try {
        await axiosInstance.delete(
          `/question-bank/${id}`
        );

        fetchQuestions();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Questions
        </h1>

        <button
          className="btn btn-primary"
          onClick={() =>
            setShowModal(true)
          }
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {/* Questions */}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : questions.length ===
        0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">
            No questions found
          </h2>

          <p className="text-base-content/70 mt-2">
            Add your first
            question.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(
            (question, index) => (
              <StoredQuestionsCard
                key={question._id}
                question={question}
                questionNumber={
                  index + 1
                }
                onEdit={(question) => {
  setEditingQuestion(
    question
  );

  setFormData({
    questionName:
      question.questionName,
    questionLink:
      question.questionLink,
    description:
      question.description,
    marks:
      question.marks,
  });

  setShowModal(true);
}}
                onDelete={
                  deleteQuestion
                }
              />
            )
          )}
        </div>
      )}

      {/* Add Question Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-6 w-[95%] max-w-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-5">
  {editingQuestion
    ? "Edit Question"
    : "Add Question"}
</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="questionName"
                placeholder="Question Name"
                className="input input-bordered w-full"
                value={
                  formData.questionName
                }
                onChange={
                  handleChange
                }
              />

              <input
                type="text"
                name="questionLink"
                placeholder="Question Link"
                className="input input-bordered w-full"
                value={
                  formData.questionLink
                }
                onChange={
                  handleChange
                }
              />

              <input
                type="number"
                name="marks"
                placeholder="Marks"
                className="input input-bordered w-full"
                value={
                  formData.marks
                }
                onChange={
                  handleChange
                }
              />

              <textarea
                name="description"
                placeholder="Description"
                rows="6"
                className="textarea textarea-bordered w-full"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(
                    false
                  );

                  setFormData({
                    questionName:
                      "",
                    questionLink:
                      "",
                    description:
                      "",
                    marks: "",
                  });

                  setEditingQuestion(null);
                }}
              >
                Cancel
              </button>

              <button
  className="btn btn-primary"
  onClick={saveQuestion}
>
  {editingQuestion
    ? "Update Question"
    : "Save Question"}
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionFolderDetails;