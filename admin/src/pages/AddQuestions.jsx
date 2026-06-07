import React, { useState } from "react";
import axiosInstance from "../lib/axios";
import QuestionCard from "../components/QuestionCard";
import {
  Plus,
  Database,
  Send,
  Layers3,
} from "lucide-react";

const AddQuestions = () => {
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([
    {
      title: "",
      problem: "",
      link: "",
      topic: "",
      difficulty: "",
      marks: "",
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        problem: "",
        link: "",
        topic: "",
        difficulty: "",
        marks: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = questions.map((q) => ({
        title: q.title.trim(),
        problem: q.problem.trim(),
        link: q.link.trim(),
        topic: q.topic.trim(),
        difficulty: q.difficulty,
        marks: Number(q.marks),
      }));

      await axiosInstance.post("/coding-questions/bulk-create", payload, {
        headers: {
          "x-admin-key": "mysecretadminkey",
        },
      });

      alert("Questions added successfully");
      setQuestions([
        {
          title: "",
          problem: "",
          link: "",
          topic: "",
          difficulty: "",
          marks: "",
        },
      ]);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to add questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const filledCount = questions.filter(
    (q) => q.title || q.problem || q.link || q.topic || q.difficulty || q.marks
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add Coding Questions
          </h1>
          <p className="text-base-content/70 mt-2 text-lg">
            Create and store questions directly in MongoDB
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
            <Database className="text-primary" size={18} />
            <div>
              <p className="text-xs text-base-content/60">Questions</p>
              <h3 className="font-bold">{questions.length}</h3>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
            <Layers3 className="text-secondary" size={18} />
            <div>
              <p className="text-xs text-base-content/60">Filled</p>
              <h3 className="font-bold">{filledCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={question}
            onChange={handleChange}
            onRemove={removeQuestion}
          />
        ))}

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-primary rounded-2xl h-12 px-6"
          >
            <Plus size={18} />
            Add Another Question
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success rounded-2xl h-12 px-6"
          >
            <Send size={18} />
            {loading ? "Saving..." : "Save Questions"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestions;