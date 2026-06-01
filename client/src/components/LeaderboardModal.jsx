import React from "react";

import LeaderboardCard from "./LeaderboardCard";

const LeaderboardModal = ({
  isOpen,
  onClose,
  leaderboard,
  fullMarks,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-base-100 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-300">

          <h2 className="text-2xl font-bold">
            🏆 Leaderboard
          </h2>

          <button
            onClick={onClose}
            className="btn btn-sm btn-circle"
          >
            ✕
          </button>

        </div>

        {/* Leaderboard List */}
        <div className="p-5 overflow-y-auto space-y-3">

          {leaderboard.length > 0 ? (

            leaderboard.map(
              (user, index) => (

                <LeaderboardCard
                  key={user._id || index}
                  rank={index + 1}
                  actualName={user.actualName}
                  username={user.username}
                  score={user.score}
                  fullMarks={fullMarks}
                />
              )
            )

          ) : (

            <div className="text-center py-10 text-base-content/60">
              No leaderboard data found.
            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default LeaderboardModal;