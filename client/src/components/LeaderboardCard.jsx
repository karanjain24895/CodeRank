import React from "react";

const LeaderboardCard = ({
  rank,
  actualName,
  username,
  score,
  fullMarks,
}) => {

  const getRankBadge = () => {

    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";

    return `#${rank}`;
  };

  return (
    <div className="bg-base-200 rounded-xl p-4 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="font-bold text-lg w-10 text-center">
          {getRankBadge()}
        </div>

        <div>
          <h3 className="font-semibold">
            {actualName}
          </h3>

          <p className="text-xs text-base-content/60">
            @{username}
          </p>
        </div>

      </div>

      <div className="font-bold text-primary">
        {score}/{fullMarks}
      </div>

    </div>
  );
};

export default LeaderboardCard;