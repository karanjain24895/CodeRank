import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Pencil,
} from "lucide-react";

import axiosInstance from "../lib/axios";

const CreatedTestCard = ({
  testId,
  testNumber,
  topicName,
}) => {

  const navigate =
    useNavigate();

  return (

    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Number */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">

            {testNumber}

          </div>

          {/* Topic */}
          <div>

            <h2 className="text-2xl font-bold text-base-content">
              {topicName}
            </h2>

            <p className="text-base-content/60">
              Created Test
            </p>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex items-center gap-3">

          {/* Edit Button */}
          <button
            onClick={() =>
              navigate(
                `/edit-test/${testId}`
              )
            }
            className="btn btn-primary rounded-2xl px-6"
          >
            <Pencil size={18} />

            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={async () => {

              const confirmed =
                window.confirm(
                  "Are you sure you want to delete this test? This will also delete all related submissions."
                );

              if (!confirmed) {
                return;
              }

              try {

                await axiosInstance.delete(
                  `/test/${testId}`
                );

                alert(
                  "Test deleted successfully"
                );

                window.location.reload();

              } catch (error) {

                console.log(error);

                alert(
                  "Failed to delete test"
                );
              }
            }}
            className="btn btn-error rounded-2xl px-6"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatedTestCard;