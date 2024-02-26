import React from "react";
import { useSocketContext } from "./SocketContext";
import { Navigate, useNavigate } from "react-router-dom";
import StartBtn from "./components/StartBtn";
import CountDown from "./components/CountDown";
import DisplayWords from "./components/DisplayWords";
import Form from "./components/Form";
import ProgessBar from "./components/ProgessBar";
import Scoreboard from "./components/Scoreboard";
import DisplayGameCode from "./components/DisplayGameCode";

function findPlayer(players) {
  const { socket } = useSocketContext();
  return players.filter((player) => player.socketId === socket.id);
}

const GameArea = ({ gameState }) => {
  const { _id, players, words, isOpen, isOver } = gameState;

  const player = findPlayer(players);
  if (_id === "") {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 ">
      <DisplayWords words={words} player={player} />
      <ProgessBar
        players={players}
        player={player}
        wordsLength={words.length}
        gameId={_id}
      />
      <Form isOpen={isOpen} isOver={isOver} gameId={_id} />
      <CountDown />
      <StartBtn player={player} gameId={_id} />
      <DisplayGameCode gameId={_id} isOpen={isOpen} isOver={isOver} />
      <Scoreboard players={players} />
    </div>
  );
};

export default GameArea;
