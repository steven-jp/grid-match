import React from "react";
import "../Game.css";
import { defaultButtonColor } from "./colors";

function ResetButton({ resetGrid }) {
  return (
    <button
      onClick={resetGrid}
      className="Reset-grid"
      style={{
        backgroundColor: defaultButtonColor,
        left: "0",
        top: "0",
      }}
    >
      Reset
    </button>
  );
}

export default ResetButton;
