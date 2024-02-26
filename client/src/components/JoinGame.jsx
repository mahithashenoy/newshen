import React, { useState } from "react";
import { useSocketContext } from "../SocketContext";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import Button from "./Button";
import toast from "react-hot-toast";

const JoinGame = () => {
  const { socket } = useSocketContext();
  const [userInput, setUserInput] = useState({
    gameId: "",
    nickName: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.gameId === "" || userInput.nickName === "") {
      return toast.error("Game id and nickname is requried 🏎️", {
        duration: 2000,
      });
    }
    socket.emit("join-game", userInput);
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold bg-black/90 text-white py-2 mt-5 rounded-md relative">
        <MoveLeft
          className="text-white absolute left-3 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        Join Game
      </h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="gameId"
          className="flex flex-col justify-center w-full max-w-md mx-auto mt-5"
        >
          Game ID :
          <input
            type="text"
            value={userInput.gameId}
            className="mt-2 p-2 border outline-none border-slate-300 rounded-md"
            placeholder="Enter Game ID"
            name="gameId"
            onChange={handleChange}
          />
        </label>
        <label
          htmlFor="gameId"
          className="flex flex-col justify-center w-full max-w-md mx-auto mt-5"
        >
          Nick Name :
          <input
            type="text"
            value={userInput.nickName}
            className="mt-2 p-2 border outline-none border-slate-300 rounded-md"
            placeholder="Enter your nickname"
            name="nickName"
            onChange={handleChange}
          />
        </label>
        <div className="flex items-center justify-center mt-4 ">
          <Button text={"Join"} customStyles={`max-w-md`} />
        </div>
      </form>
    </div>
  );
};

export default JoinGame;
