import React, { useContext } from "react";
import { GridContext } from "../App";

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
            : "rgba(210, 210, 210, 0.6)",
        }}
      >
        <b
          style={{
            color: buttonClicked ? "white" : "black",
          }}
        >
          {buttonClicked === true ? "Delete Enabled" : "Delete Disabled"}
        </b>
      </button>
    );
  }
  return null;
}

export default DeleteButton;
