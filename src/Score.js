import React, { useContext } from "react";
import "./App.css";
import { GridContext } from "./App";

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
