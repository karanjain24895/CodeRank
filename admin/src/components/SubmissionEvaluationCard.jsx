// import React from "react";

// import {
//     Code2,
//     Timer,
//     Database,
//     MessageSquareText,
//     ArrowRight,
// } from "lucide-react";

// const SubmissionEvaluationCard = ({
//     questionNumber,
//     questionName,
//     codingMarks,
//     timeComplexityMarks,
//     spaceComplexityMarks,
//     remarks,
//     isSolved,
//     onChange,
//     onUpdate,
//     onView,
// }) => {

//     const handleNumberChange = (
//         field,
//         value
//     ) => {

//         // Allow empty input
//         if (value === "") {

//             onChange(field, "");

//             return;
//         }

//         // Allow only digits
//         if (/^\d+$/.test(value)) {

//             onChange(
//                 field,
//                 Number(value)
//             );
//         }
//     };

//     return (

//         <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

//             {/* Top Row */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

//                 {/* Left */}
//                 <div className="flex items-center gap-4">

//                     {/* Question Number */}
//                     <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shrink-0">

//                         {questionNumber}

//                     </div>

//                     {/* Question Name */}
//                     <div>

//                         <h2 className="text-2xl font-bold text-base-content">

//                             {questionName}

//                         </h2>

//                     </div>
//                 </div>

//                 {/* View Button */}
//                 <button
//                     onClick={onView}
//                     className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-2xl px-5 py-4 transition-all duration-300 flex items-center gap-3 border border-base-300"
//                 >

//                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

//                         <ArrowRight size={20} />

//                     </div>

//                     <div className="text-left">

//                         <h3 className="font-bold">

//                             View Solution

//                         </h3>

//                     </div>
//                 </button>
//             </div>

//             {/* Bottom Row */}
//             <div className="flex flex-col xl:flex-row xl:items-end gap-4">

//                 {/* Coding Marks */}
//                 <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

//                     <Code2 size={20} />

//                     <input
//                         type="text"
//                         placeholder="Enter marks"
//                         value={
//                             codingMarks === 0 ||
//                             codingMarks === null ||
//                             codingMarks === undefined
//                                 ? ""
//                                 : codingMarks
//                         }
//                         onChange={(e) =>
//                             handleNumberChange(
//                                 "codingMarks",
//                                 e.target.value
//                             )
//                         }
//                         className="grow"
//                     />
//                 </label>

//                 {/* Time Complexity */}
//                 <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

//                     <Timer size={20} />

//                     <input
//                         type="text"
//                         placeholder="Enter marks"
//                         value={
//                             timeComplexityMarks === 0 ||
//                             timeComplexityMarks === null ||
//                             timeComplexityMarks === undefined
//                                 ? ""
//                                 : timeComplexityMarks
//                         }
//                         onChange={(e) =>
//                             handleNumberChange(
//                                 "timeComplexityMarks",
//                                 e.target.value
//                             )
//                         }
//                         className="grow"
//                     />
//                 </label>

//                 {/* Space Complexity */}
//                 <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

//                     <Database size={20} />

//                     <input
//                         type="text"
//                         placeholder="Enter marks"
//                         value={
//                             spaceComplexityMarks === 0 ||
//                             spaceComplexityMarks === null ||
//                             spaceComplexityMarks === undefined
//                                 ? ""
//                                 : spaceComplexityMarks
//                         }
//                         onChange={(e) =>
//                             handleNumberChange(
//                                 "spaceComplexityMarks",
//                                 e.target.value
//                             )
//                         }
//                         className="grow"
//                     />
//                 </label>

//                 {/* Remarks */}
//                 <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-[2]">

//                     <MessageSquareText
//                         size={20}
//                         className="shrink-0"
//                     />

//                     <input
//                         type="text"
//                         placeholder="Remarks"
//                         value={remarks}
//                         onChange={(e) =>
//                             onChange(
//                                 "remarks",
//                                 e.target.value
//                             )
//                         }
//                         className="grow"
//                     />
//                 </label>

//                 {/* Solved Checkbox */}
//                 <label className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-base-300 bg-base-200">

//                     <input
//                         type="checkbox"
//                         checked={isSolved}
//                         onChange={(e) =>
//                             onChange(
//                                 "isSolved",
//                                 e.target.checked
//                             )
//                         }
//                         className="checkbox checkbox-primary checkbox-sm"
//                     />

//                     <span className="font-medium whitespace-nowrap">

//                         Solved

//                     </span>

//                 </label>

//                 {/* Update Button */}
//                 <button
//                     onClick={onUpdate}
//                     className="btn btn-primary rounded-2xl h-14 px-10 text-lg"
//                 >

//                     Update

//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SubmissionEvaluationCard;

import React from "react";

import {
    Code2,
    Timer,
    Database,
    MessageSquareText,
    ArrowRight,
} from "lucide-react";

const SubmissionEvaluationCard = ({
    questionNumber,
    questionName,
    codingMarks,
    timeComplexityMarks,
    spaceComplexityMarks,
    remarks,
    isSolved,
    onChange,
    onView,
}) => {

    const handleNumberChange = (
        field,
        value
    ) => {

        if (value === "") {

            onChange(field, "");

            return;
        }

        if (/^\d+$/.test(value)) {

            onChange(
                field,
                Number(value)
            );
        }
    };

    return (

        <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

            {/* Top Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

                {/* Left */}
                <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shrink-0">

                        {questionNumber}

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-base-content">

                            {questionName}

                        </h2>

                    </div>
                </div>

                {/* View Button */}
                <button
                    onClick={onView}
                    className="bg-base-200 hover:bg-primary hover:text-primary-content rounded-2xl px-5 py-4 transition-all duration-300 flex items-center gap-3 border border-base-300"
                >

                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

                        <ArrowRight size={20} />

                    </div>

                    <div className="text-left">

                        <h3 className="font-bold">

                            View Solution

                        </h3>

                    </div>
                </button>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col xl:flex-row xl:items-end gap-4">

                {/* Coding Marks */}
                <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

                    <Code2 size={20} />

                    <input
                        type="text"
                        placeholder="Enter marks"
                        value={
                            codingMarks === 0 ||
                            codingMarks === null ||
                            codingMarks === undefined
                                ? ""
                                : codingMarks
                        }
                        onChange={(e) =>
                            handleNumberChange(
                                "codingMarks",
                                e.target.value
                            )
                        }
                        className="grow"
                    />
                </label>

                {/* Time Complexity */}
                <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

                    <Timer size={20} />

                    <input
                        type="text"
                        placeholder="Enter marks"
                        value={
                            timeComplexityMarks === 0 ||
                            timeComplexityMarks === null ||
                            timeComplexityMarks === undefined
                                ? ""
                                : timeComplexityMarks
                        }
                        onChange={(e) =>
                            handleNumberChange(
                                "timeComplexityMarks",
                                e.target.value
                            )
                        }
                        className="grow"
                    />
                </label>

                {/* Space Complexity */}
                <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-1">

                    <Database size={20} />

                    <input
                        type="text"
                        placeholder="Enter marks"
                        value={
                            spaceComplexityMarks === 0 ||
                            spaceComplexityMarks === null ||
                            spaceComplexityMarks === undefined
                                ? ""
                                : spaceComplexityMarks
                        }
                        onChange={(e) =>
                            handleNumberChange(
                                "spaceComplexityMarks",
                                e.target.value
                            )
                        }
                        className="grow"
                    />
                </label>

                {/* Remarks */}
                <label className="input input-bordered rounded-2xl flex items-center gap-3 h-14 flex-[2]">

                    <MessageSquareText
                        size={20}
                        className="shrink-0"
                    />

                    <input
                        type="text"
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) =>
                            onChange(
                                "remarks",
                                e.target.value
                            )
                        }
                        className="grow"
                    />
                </label>

                {/* Solved Checkbox */}
                <label className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-base-300 bg-base-200">

                    <input
                        type="checkbox"
                        checked={isSolved}
                        onChange={(e) =>
                            onChange(
                                "isSolved",
                                e.target.checked
                            )
                        }
                        className="checkbox checkbox-primary checkbox-sm"
                    />

                    <span className="font-medium whitespace-nowrap">

                        Solved

                    </span>

                </label>
            </div>
        </div>
    );
};

export default SubmissionEvaluationCard;