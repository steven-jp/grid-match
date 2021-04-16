import React, { useContext } from "react";
import Square from "./Square";
import Card from "./Card";
import "./App.css";
import { GridContext } from "./App";

function ClipGrid({ canvasLines, imgBlob, canvasContextHandler }) {
  // let img = new Image();
  // img.src = imgBlob;
  // img.onload = function () {
  //   ctx.drawImage(img, 0, 0, 44, 55, 0, 0, width, height);
  // };

  const gridContext = useContext(GridContext);
  // let width = gridContext.dimensions.width;
  let clicked = gridContext.renderCards;
  console.log("this should not be undefined on click: ", canvasLines[0]);
  // let height = gridContext.dimensions.height;

  //-----------------------------------

  //todo fix where to place end point if current col doesnt have a bottom row.
  //-----------------------------------
  if (clicked) {
    /* Drawing points are used to determine where to draw boxes. We want to create boxes using the top left coords
     Spanning to the bottom right coords of lines that have collisions. 
     */

    function createCoordinates() {
      const MAX_DIFF = 10;
      //min and max coordinates will always be a drawing point.
      let validCoords = [];

      let validCols = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === false,
      );

      let validRows = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === true,
      );
      // console.log(validCols);
      // console.log("rows", validRows);

      for (let i = 0; i < validCols.length; i++) {
        const currentCol = validCols[i];
        let a = containsRow("TOP", currentCol, validRows, null, MAX_DIFF);
        if (a === true) {
          //if we have a top row we must have a next col on right side.
          let sameIndexCols = validCols.filter(
            (line) => line.index === currentCol.index,
          );
          const nextCol = validCols[i + 1];
          if (
            containsRow("BOTTOM", nextCol, validRows, sameIndexCols, MAX_DIFF)
          ) {
            validCoords.push({
              xStart: currentCol.coords.x,
              yStart: currentCol.coords.y,
              xEnd: nextCol.coords.x,
              yEnd: nextCol.coords.y + nextCol.coords.height,
            });
          }
        }
      }
      return validCoords;
    }

    let validCoords = createCoordinates();
    console.log(validCoords);
    let img = new Image();
    img.src = imgBlob;
    let ctx = canvasContextHandler();
    // const ctx = canvasRef.current.getContext("2d");
    console.log(ctx);
    //find next col and row with smallest x+width  and col with smallest y >= current y + height.
    return (
      <>
        {/* <CreateGridElements /> */}
        {/* {validCoords.forEach((coordinate, i) => {
          {img.onload = function () {
            ctx.drawImage(
              img,
              coordinate.xStart,
              coordinate.yStart,
              coordinate.xEnd,
              coordinate.yEnd,
              i * 20,
              i * 20,
              width + i * 20,
              height + i * 20,
            );
          }};  */}
        {/* <> */}
        {validCoords.map((coordinate, i) => {
          const dimensions = {
            xStart: coordinate.xStart,
            yStart: coordinate.yStart,
            xEnd: coordinate.xEnd,
            yEnd: coordinate.yEnd,
          };
          return <Square key={i} dimensions={dimensions} />;
        })}
        ;{/* </> */}
        {/* <Square id="1" width={width} height={height} /> */}
        {/* <Card id="1" width={width} height={height} /> */}
      </>
    );
  }
  return null;
}

function containsRow(rowType, currentCol, rows, cols, MAX_DIFF) {
  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i];
    //Checking from left corner
    if (rowType === "TOP") {
      let xDiff = Math.abs(currentRow.coords.x - currentCol.coords.x);
      let yDiff = Math.abs(currentRow.coords.y - currentCol.coords.y);

      if (xDiff <= MAX_DIFF && yDiff <= MAX_DIFF) {
        return true;
      }
    }
    //checking bottom right corner in while loop
    if (rowType === "BOTTOM") {
      let xDiff = Math.abs(
        currentRow.coords.x +
          currentRow.coords.width -
          currentCol.coords.x +
          currentCol.coords.width,
      );
      let yDiff = Math.abs(
        currentRow.coords.y +
          currentRow.coords.height -
          currentCol.coords.y +
          currentCol.coords.height,
      );
      if (xDiff <= MAX_DIFF && yDiff <= MAX_DIFF) {
        return true;
      }
    }
  }

  return false;
}

export default ClipGrid;
