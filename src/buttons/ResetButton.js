import React, { useState } from "react";
import "../App.css";

function ResetButton({ resetGrid }) {
  return (
    <button
      onClick={resetGrid}
      className="Reset-grid"
      style={{
        backgroundColor: "rgba(210, 210, 210, 0.6)",
        left: "0",
        top: "0",
      }}
    >
      Reset
    </button>
  );
}

export default ResetButton;
