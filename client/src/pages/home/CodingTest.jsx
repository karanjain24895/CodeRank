import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import QuestionCard from "../../components/QuestionCard";

import { Clock3, Trophy, BookOpen } from "lucide-react";

import axiosInstance from "../../lib/axios";

const CodingTest = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/test/${testId}`);
        setTest(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/submissions/${testId}`);

      alert("Test Submitted Successfully");
      navigate("/attempted-tests");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Submission Failed");
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!test) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex items-center justify-center text-2xl font-bold">
        Test Not Found
      </div>
    );
  }

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-3xl shadow-2xl border border-base-300 w-full max-w-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
              <h2 className="text-3xl font-extrabold">{test.topicName}</h2>
              <p className="mt-2 opacity-90">
                Read all instructions carefully before starting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-base-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy size={22} />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Full Marks</p>
                  <h3 className="text-2xl font-bold">{test.fullMarks}</h3>
                </div>
              </div>

              <div className="bg-base-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Duration</p>
                  <h3 className="text-2xl font-bold">{test.duration} Hours</h3>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} />
                <h3 className="text-xl font-bold">Instructions</h3>
              </div>

              <div className="bg-base-200 rounded-2xl p-4 max-h-72 overflow-y-auto">
                <ul className="space-y-3">
                  {test.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="btn btn-primary w-full mt-6 h-12 rounded-xl text-base"
              >
                I Understand, Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100dvh-3.5rem)] overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-4">
        <div className="h-full min-h-0 flex flex-col">
          <div className="shrink-0 mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {test.topicName}
            </h1>
            <p className="text-base-content/70 mt-1">
              Solve all questions carefully 🚀
            </p>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 h-full min-h-0">
              <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm h-full min-h-0 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-base-300 shrink-0">
                  <h3 className="font-bold">Questions</h3>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
                  {test.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestion(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedQuestion === index
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      Question {index + 1}
                    </button>
                  ))}
                </div>

                <div className="p-4 border-t border-base-300 shrink-0">
                  <button onClick={handleSubmit} className="btn btn-primary w-full">
                    Submit Test
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 h-full min-h-0 overflow-hidden">
              <QuestionCard
                questionNumber={selectedQuestion + 1}
                title={test.questions[selectedQuestion].questionName}
                marks={test.questions[selectedQuestion].marks}
                questionLink={test.questions[selectedQuestion].questionLink}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodingTest;