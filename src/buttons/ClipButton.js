import React, { useContext } from "react";
import { GridContext } from "../App";
import { defaultButtonColor } from "./colors";

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
          backgroundColor: defaultButtonColor,
        }}
      >
        Clip Grid
      </button>
    );
  }
  return null;
}

export default ClipButton;
