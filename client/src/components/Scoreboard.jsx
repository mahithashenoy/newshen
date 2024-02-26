import React from "react";

const getScoreboard = (players) => {
  const scoreboard = players.filter((player) => player.WPM !== -1);
  return scoreboard.sort((a, b) =>
    a.WPM > b.WPM ? -1 : b.WPM > a.WPM ? 1 : 0
  );
};

const Scoreboard = ({ players }) => {
  const scoreboard = getScoreboard(players);
  return scoreboard.length > 0 ? (
    <table class="table-auto w-full mt-6">
      <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">Nick Name</th>
          <th>WPM</th>
        </tr>
      </thead>
      <tbody>
        {scoreboard.map((player, index) => {
          return (
            <tr kye={player.socketId} className="h-10 even:bg-slate-100">
              <td>{index + 1}</td>
              <td>{player.nickName}</td>
              <td className="text-center">{player.WPM}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : null;
};

export default Scoreboard;
