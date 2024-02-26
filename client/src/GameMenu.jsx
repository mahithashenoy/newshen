import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";

const GameMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
        <Button
          text={"Create Game"}
          onClick={() => navigate("/game/create")}
          customStyles={`w-max`}
        />
        <Button
          text={"Join Game"}
          customStyles={`w-max`}
          onClick={() => navigate("/game/join")}
        />
      </div>
    </>
  );
};

export default GameMenu;
