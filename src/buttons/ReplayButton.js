import React from "react";
import "../App.css";

function ReplayButton({ replayHandler }) {
  return (
    <button
      onClick={replayHandler}
      className="Replay-grid"
      style={{
        backgroundColor: "rgba(210, 210, 210, 0.6)",
        // left: "0",
        // top: "0",
      }}
    >
      Replay
    </button>
  );
}

export default ReplayButton;
