import React, { useRef, useCallback, useState, useEffect } from "react";
import DeleteButton from "./buttons/DeleteButton";
import ClipButton from "./buttons/ClipButton";
import ClipGrid from "./ClipGrid";

function Grid({
  width,
  height,
  rows,
  cols,
  imgBlob,
  renderGridHandler,
  renderCards,
}) {
  const canvasRef = useRef(null);
  const canvasLines = useRef([]);
  const [createdPreviously, setCreatedPreviously] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  // const [renderCards, setRenderCards] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    createGrid(ctx);
  }, [canvasLines]); // changed from [canvasLines.current]

  //---------------------------------------------
  /* Add test to determine if values are correct */

  /* BUG FIX NEEDED: if you draw a bunch then it will just look like a black square 
    -- if u resize the window then it removes the boxes
    -- if no more lines then crashes
  */
  /* todo: Fix rows to look like columns */
  //---------------------------------------------

  /* create grid and add view */
  const createGrid = (ctx) => {
    // ctx.beginPath();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //used to determine how big each line will be for grid.
    const lineSize = 5;
    const lineX = width / cols;
    const lineY = height / rows;
    //keep track of the current row/col for easy lookup on drag.
    let currentRow = 0;
    let currentCol = 0;
    //if we have already created the grid we want to keep deleted items in respective spots.
    if (canvasLines.current.length !== 0) {
      setCreatedPreviously(true);
    }

    //draw columns row at a time for when we check bounds in ClipGrid.
    let lastIndex = 0;
    for (let y = 0; y < height; y += lineY) {
      currentCol = 0;
      for (let x = 0; x < width; x += lineX) {
        createLine(x, y, lineSize, lineY, false, currentCol++, currentRow);
      }
      /* Draw right columns on edges of canvas to prevent 
          being out of bounds */
      if (currentCol === parseInt(cols)) {
        createLine(
          width - lineSize,
          y,
          lineSize,
          lineY,
          false,
          currentCol,
          lastIndex++,
        );
      }
      currentRow++;
    }

    currentRow = 0;
    //draw rows
    for (let y = 0; y < height; y += lineY) {
      currentCol = 0;
      for (let x = 0; x < width; x += lineX) {
        createLine(x, y, lineX, lineSize, true, currentRow, currentCol++);
      }
      currentRow++;
    }

    /* Draw bottom row on edges of canvas to prevent 
    being out of bounds */

    //Draw bottom row
    currentCol = 0;
    for (let x = 0; x < width; x += lineX) {
      createLine(
        x,
        height - lineSize,
        lineX,
        lineSize,
        true,
        parseInt(rows),
        currentCol++,
      );
    }
    function createLine(x, y, width, height, isRow, index, oppositeAxisIndex) {
      let path = new Path2D();
      path.rect(x, y, width, height);

      // If line object was already created, only update path
      if (createdPreviously === true) {
        canvasLines.current[index].path = path;
      } else {
        let line = {
          isRow: isRow,
          deleted: false,
          path: path,
          coords: { x: x, y: y, width: width, height: height },
          index: index,
          oppositeAxisIndex: oppositeAxisIndex,
        };
        canvasLines.current.push(line);
      }
    }
    draw(ctx);

    //maybe add this to context and pass down to card/square ?
    // let img = new Image();
    // img.src = imgBlob;
    // img.onload = function () {
    //   ctx.drawImage(img, 0, 0, 44, 55, 0, 0, width, height);
    // };
  };

  /* Update view of grid */
  function draw(ctx) {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasLines.current.forEach((line) => {
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
    if (buttonClicked) {
      for (let i = 0; i < canvasLines.current.length; i++) {
        if (ctx.isPointInPath(canvasLines.current[i].path, x, y, "nonzero")) {
          canvasLines.current[i].deleted = true;
        }
      }
    }
    draw(ctx);
  };

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
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    let bounds = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;
    for (let i = 0; i < canvasLines.current.length; i++) {
      if (ctx.isPointInPath(canvasLines.current[i].path, x, y, "nonzero")) {
        for (const line of canvasLines.current) {
          if (
            line.isRow === canvasLines.current[i].isRow &&
            line.index === canvasLines.current[i].index
          ) {
            gridLines.current.push(line);
          }
          if (
            line.isRow !== canvasLines.current[i].isRow &&
            line.oppositeAxisIndex === canvasLines.current[i].index - 1
          ) {
            gridLines.shrinking.push(line);
          }
          if (
            line.isRow !== canvasLines.current[i].isRow &&
            line.oppositeAxisIndex === canvasLines.current[i].index
          ) {
            gridLines.expanding.push(line);
          }
        }
        startX = x;
        startY = y;
        gridLines.moving = true;
      }
    }
  };

  //handle grid movement.
  const mouseMoveHandler = (e) => {
    e.preventDefault();
    if (gridLines.moving) {
      const ctx = canvasRef.current.getContext("2d");
      let bounds = canvasRef.current.getBoundingClientRect();
      let endX = e.clientX - bounds.left;
      let endY = e.clientY - bounds.top;

      gridLines.current.forEach((line) => {
        // move the current row or column.
        let moveX = line.isRow === true ? 0 : endX - startX;
        let moveY = line.isRow === false ? 0 : endY - startY;

        line.path = new Path2D();

        line.path.rect(
          (line.coords.x += moveX),
          (line.coords.y += moveY),
          line.coords.width,
          line.coords.height,
        );
      });
      //Shrink lines when the current row/col is moving towards it
      gridLines.shrinking.forEach((line) => {
        let moveX = line.isRow === false ? 0 : endX - startX;
        let moveY = line.isRow === true ? 0 : endY - startY;

        line.path = new Path2D();
        line.path.rect(
          line.coords.x,
          line.coords.y,
          (line.coords.width += moveX),
          (line.coords.height += moveY),
        );
      });
      //Expand lines when the current row/col is moving away.
      gridLines.expanding.forEach((line) => {
        let moveX = line.isRow === false ? 0 : endX - startX;
        let moveY = line.isRow === true ? 0 : endY - startY;

        line.path = new Path2D();
        line.path.rect(
          (line.coords.x += moveX),
          (line.coords.y += moveY),
          (line.coords.width -= moveX),
          (line.coords.height -= moveY),
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
    e.preventDefault();
    startX = 0;
    startY = 0;
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
  };

  const deleteButtonToggle = (e) => {
    setButtonClicked(!buttonClicked);
  };

  // const clipButtonHandler = (e) => {
  //   renderGridHandler();
  // };

  return (
    <div>
      <ClipButton clipButtonHandler={renderGridHandler} />
      <DeleteButton buttonClicked={buttonClicked} toggle={deleteButtonToggle} />
      <ClipGrid
        clicked={renderCards}
        canvasLines={canvasLines.current}
        width={width}
        height={height}
        imgBlob={imgBlob}
        canvasRefHandler={() => canvasRef}
      />
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
    </div>
  );
}

export default Grid;
