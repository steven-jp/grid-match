import React from "react";

// todo: add animation when clicked.

function ClipButton({ clipButtonHandler }) {
  return (
    <button
      className="Clip-grid"
      onClick={clipButtonHandler}
      style={{
        backgroundColor: "rgba(210, 210, 210, 0.6)",
      }}
    >
      <b
        style={{
          color: "black",
        }}
      >
        Clip Grid
      </b>
    </button>
  );
}

export default ClipButton;
