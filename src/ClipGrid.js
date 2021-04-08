import React from "react";
import Square from "./Square";
import Card from "./Card";
import "./App.css";

function ClipGrid({ clicked, canvasLines, width, height }) {
  console.log(clicked);
  if (clicked) {
    return (
      <>
        <Square id="1" width={width} height={height} />
        <Card id="1" width={width} height={height} />
      </>
    );
  }
  return null;
}

export default ClipGrid;
