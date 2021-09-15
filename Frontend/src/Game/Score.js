import React, { useContext } from "react";
import "./Game.css";
import { GridContext } from "./Game";

function Score() {
  const gridContext = useContext(GridContext);
  let scoreState = gridContext.scoreState; // correct, incorrect

  return (
    <div className="Score-board">
      <b>Correct: {scoreState.correct}</b>
      <b> Incorrect: {scoreState.incorrect}</b>
    </div>
  );
}

export default Score;
