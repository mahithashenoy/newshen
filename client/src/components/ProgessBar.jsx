import React from "react";
import { LogOut } from "lucide-react";
import { useSocketContext } from "../SocketContext";

function calculatePercentage(currentWordIndex, wordsLength) {
  if (currentWordIndex !== 0) {
    return ((currentWordIndex / wordsLength) * 100).toFixed(2) + "%";
  }
  return 0;
}

const ProgessBar = ({ players, player, gameId, wordsLength }) => {
  const { socket } = useSocketContext();
  let percentage = calculatePercentage(player?.[0]?.currentWordIndex, wordsLength);

  const handleEliminate = (playerId) => {
    socket.emit("eliminate-player", { gameId, playerId });
  };

  return (
    <div className="my-2 border-b border-t py-4 border-slate-200 bg-gray-50">
      {
        <div className="flex flex-col gap-1">
          <h5 className="text-black/80 text-base font-semibold">
            {player?.[0]?.nickName}
          </h5>

          <div className="w-full flex-1 h-7 rounded-3xl overflow-hidden bg-gray-200 flex items-center">
            <div
              className={`bg-green-500 text-white h-full`}
              style={{
                width: `${percentage}`,
              }}
            >
              <span className="pl-2">{percentage}</span>
            </div>
          </div>
        </div>
      }
      {players?.map((playerObj) => {
        return playerObj?.socketId !== player?.[0]?.socketId ? (
          <div className="flex flex-col mt-3 gap-1" key={playerObj.socketId}>
            <div className="flex items-center justify-between">
              <h5 className="text-black/80 text-base font-semibold">
                {playerObj?.nickName}
              </h5>
              {player?.[0]?.isPartyLeader && (
                <LogOut
                  className="text-red-600 cursor-pointer"
                  size={16}
                  onClick={() => handleEliminate(playerObj?.socketId)}
                />
              )}
            </div>
            <div className="w-full flex-1 h-7 rounded-3xl overflow-hidden  bg-gray-200 ">
              <div
                className="bg-green-500 text-white h-full"
                style={{
                  width: calculatePercentage(
                    playerObj?.currentWordIndex,
                    wordsLength
                  ),
                }}
              >
                <span className="pl-2">
                  {calculatePercentage(playerObj?.currentWordIndex, wordsLength)}
                </span>
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default ProgessBar;
