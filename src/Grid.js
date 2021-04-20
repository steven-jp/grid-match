import React, { useRef, useState, useEffect, useContext } from "react";
import DeleteButton from "./buttons/DeleteButton";
import ClipButton from "./buttons/ClipButton";
import ClipGrid from "./ClipGrid";
import { GridContext } from "./App";

function Grid({ imgBlob, renderGridHandler }) {
  const canvasRef = useRef(null);
  const canvasLines = useRef([]);

  const [createdPreviously, setCreatedPreviously] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [displayCanvas, setDisplayCanvas] = useState(true);
  const gridContext = useContext(GridContext);
  // Dimensions of canvas
  let width = gridContext.dimensions.width;
  let height = gridContext.dimensions.height;
  //Amount of rows and columns in grid.
  let rows = gridContext.gridDimensions.rows;
  let cols = gridContext.gridDimensions.cols;
  //Keep track of where to place grid and squares on canvas
  let maxWidth = gridContext.maxWidth;
  let setMaxWidth = gridContext.setMaxWidth;
  let maxHeight = gridContext.maxHeight;
  let setMaxHeight = gridContext.setMaxHeight;
  let minHeight = gridContext.minHeight;
  let setMinHeight = gridContext.setMinHeight;
  let minWidth = gridContext.minWidth;
  let setMinWidth = gridContext.setMinWidth;

  const [renderContext, setRenderContext] = useState(null); // fix this

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    createGrid(ctx);
    setRenderContext(ctx);
  }, [canvasLines]); // changed from [canvasLines.current]

  function calculateGridSize() {
    let maxX = 0,
      minX = Number.MAX_VALUE,
      maxY = 0,
      minY = Number.MAX_VALUE;
    canvasLines.current.forEach((line) => {
      maxX = Math.max(maxX, line.coords.x + line.coords.width);
      maxY = Math.max(maxY, line.coords.y + line.coords.height);
      minX = Math.min(minX, line.coords.x);
      minY = Math.min(minY, line.coords.y);
    });
    setMaxHeight(maxY);
    setMaxWidth(maxX);
    setMinHeight(minY);
    setMinWidth(minX);
    console.log(canvasLines);
  }

  //---------------------------------------------
  /* Add test to determine if values are correct */

  /* BUG FIX NEEDED: if you draw a bunch then it will just look like a black square 
    -- if u resize the window then it removes the boxes
    -- if no more lines then crashes
  */
  // clipping isn't working properly at correct location. off by a lil
  //moving around grid causes issues sometimes where it creates extra columns/rows.
  /* todo: Fix rows to look like columns */
  //---------------------------------------------

  /* create grid and add view */
  const createGrid = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //used to determine how big each line will be for grid.
    const lineSize = 5;
    const lineX = (maxWidth - minWidth) / cols;
    const lineY = (maxHeight - minHeight) / rows;
    //keep track of the current row/col for easy lookup on drag.
    let currentRow = 0;
    let currentCol = 0;
    //if we have already created the grid we want to keep deleted items in respective spots.
    if (canvasLines.current.length !== 0) {
      setCreatedPreviously(true);
    }
    //draw columns row at a time for when we check bounds in ClipGrid.
    let lastIndex = 0;
    for (let y = minHeight; y < maxHeight; y += lineY) {
      currentCol = 0;
      for (let x = minWidth; x < maxWidth; x += lineX) {
        createLine(x, y, lineSize, lineY, false, currentCol++, currentRow);
      }
      /* Draw right columns on edges of canvas to prevent 
          being out of bounds */
      if (currentCol === parseInt(cols)) {
        createLine(
          maxWidth - lineSize,
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
    for (let y = minHeight; y < maxHeight; y += lineY) {
      currentCol = 0;
      for (let x = minWidth; x < maxWidth; x += lineX) {
        createLine(x, y, lineX, lineSize, true, currentRow, currentCol++);
      }
      currentRow++;
    }

    /* Draw bottom row on edges of canvas to prevent 
    being out of bounds */

    //Draw bottom row
    currentCol = 0;
    for (let x = minWidth; x < maxWidth; x += lineX) {
      createLine(
        x,
        maxHeight - lineSize,
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

      // If line object was already created, only update path
      if (createdPreviously === true) {
        canvasLines.current[index].path = path;
      } else {
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
    }

    draw(ctx);
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
        if (ctx.isPointInPath(canvasLines.current[i].path, x, y, "nonzero")) {
          canvasLines.current[i].deleted = true;
        }
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
    startX = 0;
    startY = 0;
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
    calculateGridSize();
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
        imgBlob={imgBlob}
        setDisplayCanvas={setDisplayCanvas}
        canvasContextHandler={() => renderContext}
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
