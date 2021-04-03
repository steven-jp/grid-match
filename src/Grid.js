import React, { useRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Grid({ width, height, rows, cols }) {
  const canvasRef = useRef(null);
  let canvasLines = [];

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    createGrid(ctx);
  }, [canvasRef]);

  /* Add test to determine if values are correct */

  /* BUG FIX NEEDED: if you draw a bunch then it will just look like a black square 
    -- if u resize the window then it removes the boxes
  */

  /* create grid and add view */
  const createGrid = (ctx) => {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //used to determine how big each line will be for grid.
    const lineSize = 5;
    const lineX = width / cols;
    const lineY = height / rows;
    //keep track of the current row/col for easy lookup on drag.
    let currentRow = 0;
    let currentCol = 0;
    //if we have already created the grid we want to keep deleted items in respective spots.
    let createdPreviously = false;
    if (canvasLines.length != 0) {
      createdPreviously = true;
    }

    //draw columns
    for (let x = 0; x < width; x += lineX) {
      for (let y = 0; y < height; y += lineY) {
        createLine(x, y, lineSize, lineY, createdPreviously, false, currentCol);
      }
      currentCol++;
    }

    //draw rows
    for (let y = 0; y < height; y += lineY) {
      for (let x = 0; x < width; x += lineX) {
        createLine(x, y, lineX, lineSize, createdPreviously, true, currentRow);
      }
      currentRow++;
    }

    /* Draw right and bottom lines on edges of canvas to prevent 
    being out of bounds */

    //right column
    for (let y = 0; y < height; y += lineY) {
      createLine(
        width - lineSize,
        y,
        lineSize,
        lineY,
        createdPreviously,
        false,
        parseInt(cols),
      );
    }

    //Draw bottom row
    for (let x = 0; x < width; x += lineX) {
      createLine(
        x,
        height - lineSize,
        lineX,
        lineSize,
        createdPreviously,
        true,
        parseInt(rows),
      );
    }

    function createLine(x, y, width, height, createdPreviously, row, index) {
      let path = new Path2D();
      path.rect(x, y, width, height);

      // If line object was already created, only update path
      if (createdPreviously === true) {
        canvasLines[index].path = path;
      } else {
        // ctx.fill(path, "nonzero");
        canvasLines.push({
          row: row,
          deleted: false,
          path: path,
          coords: { x: x, y: y, width: width, height: height },
          index: index,
        });
      }
    }
    draw(ctx);
    // console.log(canvasLines);
  };

  /* Update view of grid */
  function draw(ctx) {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasLines.forEach((line) => {
      //only draw lines that haven't been deleted
      if (line.deleted === false) {
        ctx.fill(line.path, "nonzero");
      }
    });
  }

  const onClickHandler = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    let bounds = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;

    for (let i = 0; i < canvasLines.length; i++) {
      if (ctx.isPointInPath(canvasLines[i].path, x, y, "nonzero")) {
        canvasLines[i].deleted = true;
        if (canvasLines[i].row === true) {
        }
      }
    }
    draw(ctx);
  };

  //   const onDragHandler = (e) => {
  //     const ctx = canvasRef.current.getContext("2d");
  //     let bounds = canvasRef.current.getBoundingClientRect();
  //     let x = e.clientX - bounds.left;
  //     let y = e.clientY - bounds.top;
  //     console.log(canvasLines);

  //     for (let i = 0; i < canvasLines.length; i++) {
  //       if (ctx.isPointInPath(canvasLines[i]["path"], x, y, "nonzero")) {
  //         //shrink columns (Height)
  //         if (canvasLines[i]["row"] === true) {
  //         }
  //         //shrink rows (Width)
  //         else {
  //         }
  //         canvasLines[i] = new Path2D();
  //       }
  //     }
  //     // console.log(e.clientX);
  //     createGrid(ctx);
  //   };

  /* =============Mouse movements for dragging lines=============*/
  let startX = 0,
    startY = 0,
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
  //Get starting coordinates of grid element that was clicked.
  const mouseDownHandler = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    let bounds = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;
    for (let i = 0; i < canvasLines.length; i++) {
      if (ctx.isPointInPath(canvasLines[i].path, x, y, "nonzero")) {
        canvasLines.forEach((line) => {
          if (
            line.row === canvasLines[i].row &&
            line.index === canvasLines[i].index
          ) {
            gridLines.current.push(line);
          }
        });
        startX = x;
        startY = y;
        gridLines.moving = true;
      }
    }
  };

  //handle grid movement.
  const mouseMoveHandler = (e) => {
    if (gridLines.moving) {
      const ctx = canvasRef.current.getContext("2d");
      let bounds = canvasRef.current.getBoundingClientRect();
      let endX = e.clientX - bounds.left;
      let endY = e.clientY - bounds.top;

      gridLines.current.forEach((line) => {
        // move the current row or column.
        let moveX = line.row === true ? 0 : endX - startX;
        let moveY = line.row === false ? 0 : endY - startY;

        line.path = new Path2D();
        line.path.rect(
          (line.coords.x += moveX),
          (line.coords.y += moveY),
          line.coords.width,
          line.coords.height,
        );
      });

      //set starting coordinates from where we left off.
      startX = endX;
      startY = endY;
      draw(ctx);
    }
  };

  //disable grid movement.
  const mouseUpHandler = (e) => {
    startX = 0;
    startY = 0;
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="Grid"
      width={width}
      height={height}
      onClick={onClickHandler}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
    ></canvas>
  );
}

export default Grid;
