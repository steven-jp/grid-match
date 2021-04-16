import React, { useContext } from "react";
import { GridContext } from "../App";

// todo: add animation when clicked.

function ClipButton({ clipButtonHandler }) {
  const gridContext = useContext(GridContext);
  let renderButton = gridContext.renderButtons.clip;
  // let width = gridContext.dimensions.width;
  // let renderImg = gridContext.setRenderImage;
  if (renderButton) {
    return (
      <button
        className="Clip-grid"
        onClick={clipButtonHandler}
        //      onClick={() => renderImg(false)}
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
  return null;
}

export default ClipButton;
