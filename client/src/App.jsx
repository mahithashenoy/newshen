import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import GameMenu from "./GameMenu";

import { useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import GameArea from "./GameArea";
import Layout from "./Layout";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import toast from "react-hot-toast";

const App = () => {
  const { socket } = useSocketContext();
  const [gameState, setGameState] = useState({
    _id: "",
    isOpen: false,
    words: [],
    players: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateGame", (gameDetails) => {
      setGameState(gameDetails);
    });
    socket.on("join-game-error", (error) => {
      toast.error(`Error joining game: ${error.error}`, {
        duration: 2000,
      });
    });
    socket.on("elimination-success", (error) => {
      toast.error(`${error.message}`, {
        duration: 4000,
      });
      navigate("/");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }, []);

  useEffect(() => {
    if (gameState._id !== "") {
      navigate(`/game/${gameState._id}`);
    }
  }, [gameState._id]);

  return (
    <>
      <Routes>
        <Route
          path={"/"}
          element={
            <Layout>
              <GameMenu />
            </Layout>
          }
        />
        <Route
          path={"/game/create"}
          element={
            <Layout>
              <CreateGame />
            </Layout>
          }
        />
        <Route
          path={"/game/join"}
          element={
            <Layout>
              <JoinGame />
            </Layout>
          }
        />
        <Route
          path={"/game/:gameId"}
          element={
            <Layout>
              <GameArea gameState={gameState} />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
