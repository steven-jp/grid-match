import React, { useContext } from "react";
import { GridContext } from "../Game";
import { defaultButtonColor } from "./colors";

function DeleteButton({ buttonClicked, toggle }) {
  const gridContext = useContext(GridContext);
  let renderButton = gridContext.renderButtons.delete;
  if (renderButton) {
    return (
      <button
        className="Delete-grid"
        onClick={toggle}
        style={{
          backgroundColor: buttonClicked
            ? "rgba(45, 49, 92, 0.75)"
            : defaultButtonColor,
          color: buttonClicked ? "white" : "black",
        }}
      >
        {buttonClicked === true ? "Delete Enabled" : "Delete Disabled"}
      </button>
    );
  }
  return null;
}

export default DeleteButton;
