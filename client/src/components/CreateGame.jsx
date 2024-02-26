import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../SocketContext";
import Button from "./Button";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

const CreateGame = () => {
  const { socket } = useSocketContext();
  const [nickName, setNickName] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickName === "") {
      return toast.error("Your nickname is missing ☺️", {
        duration: 2000,
      });
    }
    socket.emit("create-game", nickName);
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold bg-black/90 text-white py-2 mt-5 rounded-md relative">
        <MoveLeft
          className="text-white absolute left-3 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        Create Game
      </h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="nickname"
          className="flex flex-col justify-center w-full max-w-md mx-auto mt-5"
        >
          Nick Name :
          <input
            type="text"
            value={nickName}
            className="mt-2 p-2 border outline-none border-slate-300 rounded-md"
            placeholder="Enter your nick name"
            onChange={(e) => setNickName(e.target.value)}
          />
        </label>
        <div className="flex items-center justify-center mt-4 ">
          <Button text={"Submit"} customStyles={`max-w-md`} />
        </div>
      </form>
    </div>
  );
};

export default CreateGame;
