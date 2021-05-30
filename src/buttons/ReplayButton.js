import React from "react";
import "../App.css";
import { defaultButtonColor } from "./colors";

function ReplayButton({ replayHandler }) {
  return (
    <button
      onClick={replayHandler}
      className="Replay-grid"
      style={{
        backgroundColor: defaultButtonColor,
      }}
    >
      Replay
    </button>
  );
}

export default ReplayButton;
