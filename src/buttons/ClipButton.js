import React, { useContext } from "react";
import { GridContext } from "../App";

// todo: add animation when clicked.

function ClipButton() {
  const gridContext = useContext(GridContext);
  let renderButton = gridContext.renderButtons.clip;
  let renderGridHandler = gridContext.renderGridHandler;

  if (renderButton) {
    return (
      <button
        className="Clip-grid"
        onClick={renderGridHandler}
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
