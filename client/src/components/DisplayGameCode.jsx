import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const DisplayGameCode = ({ gameId, isOpen, isOver }) => {
  const [isCopy, setIsCopy] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    setIsCopy(true);
    navigator.clipboard.writeText(gameId);

    setTimeout(() => {
      setIsCopy(false);
    }, 3000);
  };

  return isOver && !isOpen ? (
    <div className="flex items-center justify-center my-3">
      <Button
        text={"Start Again"}
        onClick={() => navigate("/")}
        customStyles={`max-w-md`}
      />
    </div>
  ) : (
    <div className="flex  py-4 flex-col justify-center items-center my-4">
      <h3 className="mb-3 send_code text-center">
        Send this code to your friend's for them to join
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p className="border-dashed border bg-slate-100 select-none  p-3 border-slate-400 rounded-sm">
          {gameId}
        </p>
        <button
          onClick={handleCopy}
          className="relative inline-block text-lg group"
        >
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
            <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
            <span className="relative">{isCopy ? "Copied" : "Copy"}</span>
          </span>
          <span
            className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
            datarounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default DisplayGameCode;
