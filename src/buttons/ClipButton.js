import React, { useContext } from "react";
import { GridContext } from "../App";

// todo: add animation when clicked.

function ClipButton({ clipButtonHandler }) {
  const gridContext = useContext(GridContext);
  let renderButton = gridContext.renderButtons.clip;

  if (renderButton) {
    return (
      <button
        className="Clip-grid"
        onClick={clipButtonHandler}
        style={{
          backgroundColor: "rgba(210, 210, 210, 0.6)",
        }}
      >
        Clip Grid
      </button>
    );
  }
  return null;
}

export default ClipButton;
