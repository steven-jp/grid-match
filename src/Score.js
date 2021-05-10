import React, { useContext } from "react";
import "./App.css";
import { GridContext } from "./App";

function Score() {
  const gridContext = useContext(GridContext);
  let scoreState = gridContext.scoreState; // correct, incorrect

  return (
    <div className="Score-board">
      Correct: {scoreState.correct}
      Incorrect: {scoreState.incorrect}
    </div>
  );
}

export default Score;
