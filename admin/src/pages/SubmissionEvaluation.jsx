// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useParams,
// } from "react-router-dom";

// import axiosInstance from "../lib/axios";

// import SubmissionEvaluationCard from "../components/SubmissionEvaluationCard";

// const SubmissionEvaluation = () => {

//   const { submissionId } =
//     useParams();

//   const [loading, setLoading] =
//     useState(true);

//   const [submitting, setSubmitting] =
//     useState(false);

//   const [evaluated, setEvaluated] =
//     useState(false);

//   const [topicName, setTopicName] =
//     useState("");

//   const [username, setUsername] =
//     useState("");

//   const [questions, setQuestions] =
//     useState([]);

//   // Fetch Submission
//   useEffect(() => {

//     const fetchSubmission =
//       async () => {

//         try {

//           const res =
//             await axiosInstance.get(
//               `/submissions/${submissionId}`,
//               {
//             headers: {
//               "x-admin-key":
//                 "mysecretadminkey",
//             },
//           }
//             );

//           const submission =
//             res.data;

//           setTopicName(
//             submission.test.topicName
//           );

//           setUsername(
//             submission.user.username
//           );

//           setQuestions(
//             submission.questions
//           );

//           setEvaluated(
//   submission.isEvaluated || false
// );

//         } catch (error) {

//           console.log(error);

//         } finally {

//           setLoading(false);
//         }
//       };

//     fetchSubmission();

//   }, [submissionId]);

//   // Update Inputs
//   const handleChange = (
//     index,
//     field,
//     value
//   ) => {

//     setQuestions((prev) =>
//       prev.map((q, i) => {

//         if (i !== index) {
//           return q;
//         }

//         return {
//           ...q,

//           [field]:

//             field === "isSolved"

//               ? value

//               : field === "remarks"

//                 ? value

//                 : Number(value),
//         };
//       })
//     );
//   };

//   // Update Question
//   const handleUpdate =
//     async (
//       index,
//       question
//     ) => {

//       try {

//         await axiosInstance.patch(
//   `/submissions/evaluate/${submissionId}/${index}`,

//   {
//     codingMarks:
//       question.codingMarks,

//     timeComplexityMarks:
//       question.timeComplexityMarks,

//     spaceComplexityMarks:
//       question.spaceComplexityMarks,

//     remarks:
//       question.remarks,

//     isSolved:
//       question.isSolved,
//   },

//   {
//     headers: {
//       "x-admin-key":
//         "mysecretadminkey",
//     },
//   }
// );

//         alert(
//           "Evaluation Updated"
//         );

//       } catch (error) {

//         console.log(error);
//       }
//     };

//   // Mark Entire Submission Evaluated
//   const handleEvaluationToggle =
//   async (checked) => {

//     try {

//       // update UI immediately
//       setEvaluated(checked);

//       await axiosInstance.patch(
//         `/submissions/${submissionId}/status`,
//         {
//           isEvaluated: checked,
//         },
//         {
//             headers: {
//               "x-admin-key":
//                 "mysecretadminkey",
//             },
//           }
//       );

//     } catch (error) {

//       console.log(error);
//     }
// };
//   // const handleCompleteEvaluation =
//   //   async (
//   //     checked
//   //   ) => {

//   //     if (!checked) return;

//   //     try {

//   //       setSubmitting(true);

//   //       // await axiosInstance.patch(
//   //       //   `/submissions/${submissionId}/status`,
//   //       //   {
//   //       //     status: "evaluated",
//   //       //     evaluated: true,
//   //       //   }
//   //       // );

//   //       await axiosInstance.patch(
//   //         `/submissions/${submissionId}/status`,
//   //         {
//   //           isEvaluated: checked,
//   //         }
//   //       );

//   //       setEvaluated(true);

//   //       alert(
//   //         "Submission marked as evaluated"
//   //       );

//   //     } catch (error) {

//   //       console.log(error);

//   //     } finally {

//   //       setSubmitting(false);
//   //     }
//   //   };

//   // View Question
//   const handleView = (
//     question
//   ) => {

//     window.open(
//       question.questionLink,
//       "_blank"
//     );
//   };

//   if (loading) {

//     return (
//       <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

//       {/* Header */}
//       <div className="mb-10">

//         <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//           Submission Evaluation
//         </h1>

//         <p className="text-base-content/70 mt-3 text-lg">
//           Review and evaluate student submissions 🚀
//         </p>
//       </div>

//       {/* Submission Info */}
//       <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-md mb-8">

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//           {/* Topic Name */}
//           <div className="bg-base-200 rounded-2xl p-5">

//             <p className="text-sm text-base-content/60 mb-2">
//               Topic Name
//             </p>

//             <h2 className="text-3xl font-bold">
//               {topicName}
//             </h2>
//           </div>

//           {/* Username */}
//           <div className="bg-base-200 rounded-2xl p-5">

//             <p className="text-sm text-base-content/60 mb-2">
//               Username
//             </p>

//             <h2 className="text-3xl font-bold">
//               {username}
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* Question Evaluations */}
//       <div className="space-y-6">

//         {questions.map(
//           (
//             question,
//             index
//           ) => (

//             <SubmissionEvaluationCard
//               key={index}

//               questionNumber={
//                 index + 1
//               }

//               questionName={
//                 question.questionName
//               }

//               codingMarks={
//                 question.codingMarks
//               }

//               timeComplexityMarks={
//                 question.timeComplexityMarks
//               }

//               spaceComplexityMarks={
//                 question.spaceComplexityMarks
//               }

//               remarks={
//                 question.remarks
//               }

//               isSolved={
//                 question.isSolved || false
//               }

//               onChange={(
//                 field,
//                 value
//               ) =>
//                 handleChange(
//                   index,
//                   field,
//                   value
//                 )
//               }

//               onUpdate={() =>
//                 handleUpdate(
//                   index,
//                   question
//                 )
//               }

//               onView={() =>
//                 handleView(
//                   question
//                 )
//               }
//             />
//           )
//         )}
//       </div>

//       {/* Final Evaluation Checkbox */}
//       <div className="mt-10 bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md">

//         <label className="flex items-center gap-4 cursor-pointer">

//           <input
//             type="checkbox"

//             className="checkbox checkbox-success checkbox-lg"

//             checked={evaluated}

//             // disabled={
//             //   evaluated ||
//             //   submitting
//             // }

//             onChange={(e) =>
//               handleEvaluationToggle(
//                 e.target.checked
//               )
//             }
//           />

//           <div>

//             <h2 className="text-xl font-bold">

//               {
//                 evaluated

//                   ? "Submission Evaluated"

//                   : "Mark Submission As Evaluated"
//               }

//             </h2>

//             <p className="text-base-content/60">

//               {
//                 evaluated

//                   ? "Evaluation has been completed"

//                   : "Set as mark to make evaluation complete"
//               }

//             </p>
//           </div>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default SubmissionEvaluation;

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import axiosInstance from "../lib/axios";

import SubmissionEvaluationCard from "../components/SubmissionEvaluationCard";

const SubmissionEvaluation = () => {

  const { submissionId } =
    useParams();

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [evaluated, setEvaluated] =
    useState(false);

  const [topicName, setTopicName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [questions, setQuestions] =
    useState([]);

  // Fetch Submission
  useEffect(() => {

    const fetchSubmission =
      async () => {

        try {

          const res =
            await axiosInstance.get(
              `/submissions/${submissionId}`,
              {
                headers: {
                  "x-admin-key":
                    "mysecretadminkey",
                },
              }
            );

          const submission =
            res.data;

          setTopicName(
            submission.test.topicName
          );

          setUsername(
            submission.user.username
          );

          setQuestions(
            submission.questions
          );

          setEvaluated(
            submission.isEvaluated || false
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchSubmission();

  }, [submissionId]);

  // Input Change
  const handleChange = (
    index,
    field,
    value
  ) => {

    setQuestions((prev) =>
      prev.map((q, i) => {

        if (i !== index) {
          return q;
        }

        return {
          ...q,

          [field]:

            field === "isSolved"

              ? value

              : field === "remarks"

                ? value

                : value === ""

                  ? ""

                  : Number(value),
        };
      })
    );
  };

  // Update Entire Submission
  const handleUpdateAll =
    async () => {

      try {

        setSubmitting(true);

        // Update every question
        for (
          let index = 0;
          index < questions.length;
          index++
        ) {

          const question =
            questions[index];

          await axiosInstance.patch(
            `/submissions/evaluate/${submissionId}/${index}`,

            {
              codingMarks:
                question.codingMarks || 0,

              timeComplexityMarks:
                question.timeComplexityMarks || 0,

              spaceComplexityMarks:
                question.spaceComplexityMarks || 0,

              remarks:
                question.remarks,

              isSolved:
                question.isSolved,
            },

            {
              headers: {
                "x-admin-key":
                  "mysecretadminkey",
              },
            }
          );
        }

        // Update evaluation status only after all questions updated
        await axiosInstance.patch(
          `/submissions/${submissionId}/status`,
          {
            isEvaluated:
              evaluated,
          },
          {
            headers: {
              "x-admin-key":
                "mysecretadminkey",
            },
          }
        );

        alert(
          "Submission Updated Successfully"
        );

      } catch (error) {

        console.log(error);

      } finally {

        setSubmitting(false);
      }
    };

  // View Question
  const handleView = (
    question
  ) => {

    window.open(
      question.questionLink,
      "_blank"
    );
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

          Submission Evaluation

        </h1>

        <p className="text-base-content/70 mt-3 text-lg">

          Review and evaluate student submissions 🚀

        </p>
      </div>

      {/* Submission Info */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-md mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Topic Name */}
          <div className="bg-base-200 rounded-2xl p-5">

            <p className="text-sm text-base-content/60 mb-2">

              Topic Name

            </p>

            <h2 className="text-3xl font-bold">

              {topicName}

            </h2>
          </div>

          {/* Username */}
          <div className="bg-base-200 rounded-2xl p-5">

            <p className="text-sm text-base-content/60 mb-2">

              Username

            </p>

            <h2 className="text-3xl font-bold">

              {username}

            </h2>
          </div>
        </div>
      </div>

      {/* Question Evaluations */}
      <div className="space-y-6">

        {questions.map(
          (
            question,
            index
          ) => (

            <SubmissionEvaluationCard
              key={index}

              questionNumber={
                index + 1
              }

              questionName={
                question.questionName
              }

              codingMarks={
                question.codingMarks
              }

              timeComplexityMarks={
                question.timeComplexityMarks
              }

              spaceComplexityMarks={
                question.spaceComplexityMarks
              }

              remarks={
                question.remarks
              }

              isSolved={
                question.isSolved || false
              }

              onChange={(
                field,
                value
              ) =>
                handleChange(
                  index,
                  field,
                  value
                )
              }

              onView={() =>
                handleView(
                  question
                )
              }
            />
          )
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-10 bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Final Evaluation Checkbox */}
          <label className="flex items-center gap-4 cursor-pointer">

            <input
              type="checkbox"

              className="checkbox checkbox-success checkbox-lg"

              checked={evaluated}

              onChange={(e) =>
                setEvaluated(
                  e.target.checked
                )
              }
            />

            <div>

              <h2 className="text-xl font-bold">

                {
                  evaluated

                    ? "Submission Evaluated"

                    : "Mark Submission As Evaluated"
                }

              </h2>

              <p className="text-base-content/60">

                Evaluation status will update only after clicking Update button

              </p>
            </div>
          </label>

          {/* Update Button */}
          <button
            onClick={handleUpdateAll}
            disabled={submitting}
            className="btn btn-primary rounded-2xl h-14 px-10 text-lg"
          >

            {
              submitting

                ? "Updating..."

                : "Update All Evaluations"
            }

          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionEvaluation;