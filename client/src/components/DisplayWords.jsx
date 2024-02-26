import React from "react";

function getTypedWords(words, player) {
  let typedWords = words?.slice(0, player?.currentWordIndex);
  typedWords = typedWords.join(" ");
  return <span className="text-green-500 select-none">{typedWords} </span>;
}
function getCurrentWords(words, player) {
  return (
    <span className="text-blue-500 select-none">{words?.[player?.currentWordIndex]} </span>
  );
}
function getWordsToBeTyped(words, player) {
  let remainingWords = words.slice(
    player?.currentWordIndex + 1,
    words?.length + 1
  );
  remainingWords = remainingWords.join(" ");
  return <span className="text-gray-400 select-none"> {remainingWords} </span>;
}

const DisplayWords = ({ words, player }) => {
  return (
    <>
      {getTypedWords(words, player[0])}
      {getCurrentWords(words, player[0])}
      {getWordsToBeTyped(words, player[0])}
    </>
  );
};

export default DisplayWords;
