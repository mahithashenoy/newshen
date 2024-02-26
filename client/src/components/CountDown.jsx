import React, { useEffect, useState } from "react";
import { useSocketContext } from "../SocketContext";

const CountDown = () => {
  const { socket } = useSocketContext();
  const [timer, setTimer] = useState({
    countDown: "",
    msg: "",
  });

  useEffect(() => {
    socket.on("timer", (data) => {
      setTimer(data);
    });

    socket.on("done", () => {
      socket.removeListener("timer");
    });
  }, []);

  return (
    <div className="text-center mt-4">
      <h2 className="text-5xl font-bold">{timer.countDown}</h2>
      <p className="mt-2">{timer.msg}</p>
    </div>
  );
};

export default CountDown;
