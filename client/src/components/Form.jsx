import React, { useEffect, useRef } from "react";
import { useSocketContext } from "../SocketContext";
import { useState } from "react";

const Form = ({ isOpen, isOver, gameId }) => {
  const { socket } = useSocketContext();
  const [userInput, setUserInput] = useState("");
  let textInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      textInputRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    let { value } = e.target;
    let lastChar = value.charAt(value.length - 1);
    if (lastChar === " ") {
      socket.emit("userInput", { userInput, gameId });
      setUserInput("");
    } else {
      setUserInput(value);
    }
  };
  return (
    <div>
      <div></div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          readOnly={isOpen || isOver}
          disabled={isOpen || isOver}
          placeholder="Start Typing..."
          value={userInput}
          onChange={handleChange}
          ref={textInputRef}
          className="border disabled:bg-gray-100  border-slate-300 rounded-md shadow-xl w-full p-2 resize-none mt-4"
        />
        <p className="mt-2 mb-4 text-xs text-gray-600">
          <b>Note: </b>
          To go to the next word, enter the current word correctly and press the{" "}
          <kbd className="bg-slate-200 px-2">Space</kbd> key.
        </p>
      </form>
      <div></div>
    </div>
  );
};

export default Form;
