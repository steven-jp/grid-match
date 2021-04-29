import React, { useRef, useState, useEffect, useContext } from "react";
import DeleteButton from "./buttons/DeleteButton";
import ClipButton from "./buttons/ClipButton";
import ClipGrid from "./ClipGrid";
import { GridContext } from "./App";

function Grid({ renderGridHandler }) {
  const canvasRef = useRef(null);
  // const canvasLines = useRef([]);

  const [deleteClicked, setDeleteClicked] = useState(false);
  const [displayCanvas, setDisplayCanvas] = useState(true);
  const gridContext = useContext(GridContext);
  // Dimensions of canvas
  let width = gridContext.dimensions.width;
  let height = gridContext.dimensions.height;
  //Amount of rows and columns in grid.
  let rows = gridContext.gridDimensions.rows;
  let cols = gridContext.gridDimensions.cols;
  let createdPreviously = gridContext.createdPreviously;
  let setCreatedPreviously = gridContext.setCreatedPreviously;
  let canvasLines = gridContext.canvasLines;
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // only create out canvas lines if they weren't created yet.
    if (!createdPreviously) {
      createGrid(ctx);
    } else {
      draw(ctx);
    }
  }, [canvasRef]); // changed from [canvasLines.current]

  //---------------------------------------------
  /* Add test to determine if values are correct */

  /* BUG FIX NEEDED: if you draw a bunch then it will just look like a black square 
    -- if no more lines then crashes
  */
  // clipping isn't working properly at correct location. off by a lil
  //---------------------------------------------

  /* create grid and add view */
  const createGrid = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //used to determine how big each line will be for grid.
    const lineSize = 5;
    const lineX = (width - 0) / cols;
    const lineY = (height - 0) / rows;
    //keep track of the current row/col for easy lookup on drag.
    let currentRow = 0;
    let currentCol = 0;
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
    function createLine(
      x,
      y,
      lineWidth,
      lineHeight,
      isRow,
      index,
      oppositeAxisIndex,
    ) {
      let path = new Path2D();
      path.rect(x, y, lineWidth, lineHeight);

      let line = {
        isRow: isRow,
        deleted: false,
        path: path,
        coords: { x: x, y: y, width: lineWidth, height: lineHeight },
        index: index,
        oppositeAxisIndex: oppositeAxisIndex,
      };
      canvasLines.current.push(line);
    }

    draw(ctx);
    setCreatedPreviously(true);
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
    if (deleteClicked) {
      const ctx = canvasRef.current.getContext("2d");
      let bounds = canvasRef.current.getBoundingClientRect();
      let x = e.clientX - bounds.left;
      let y = e.clientY - bounds.top;
      for (let i = 0; i < canvasLines.current.length; i++) {
        let currentLine = canvasLines.current[i];
        if (ctx.isPointInPath(currentLine.path, x, y, "nonzero")) {
          // console.log(rows);
          // if (
          //   currentLine.index !== 0 &&
          //   ((currentLine.isRow && currentLine.index !== rows) ||
          //     (!currentLine.isRow && currentLine.index !== cols))
          // ) {
          currentLine.deleted = true;
        }
        // }
      }
      draw(ctx);
    }
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
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
  };

  return (
    <div>
      <ClipButton clipButtonHandler={renderGridHandler} />
      <DeleteButton
        buttonClicked={deleteClicked}
        toggle={() => setDeleteClicked(!deleteClicked)}
      />
      <ClipGrid
        canvasLines={canvasLines.current}
        setDisplayCanvas={setDisplayCanvas}
      />
      {displayCanvas ? (
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
      ) : null}
    </div>
  );
}

export default Grid;
