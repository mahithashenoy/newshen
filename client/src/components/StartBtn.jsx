import React, { useState } from "react";
import Button from "./Button";
import { useSocketContext } from "../SocketContext";

const StartBtn = ({ player, gameId }) => {
  const { socket } = useSocketContext();
  const [showBtn, setShowBtn] = useState(true);
  const isPartyLeader = player?.[0]?.isPartyLeader;

  const onClickHandler = (e) => {
    socket.emit("timer", { playerId: player?.[0]?._id, gameId });
    setShowBtn(false);
  };

  return isPartyLeader && showBtn ? (
    <div className="flex items-center justify-center mt-4">
      <Button
        text={`Start Game`}
        onClick={onClickHandler}
        customStyles={`max-w-md`}
      />
    </div>
  ) : null;
};

export default StartBtn;
