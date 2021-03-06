import React, { useRef, useState, useEffect, useContext } from "react";
import DeleteButton from "./Buttons/DeleteButton";
import ClipButton from "./Buttons/ClipButton";
import ClipGrid from "./ClipGrid";
import { GridContext } from "./Game";
import { GridDfs } from "./GridDfs";

function Grid() {
  // to get context of canvas.
  const canvasRef = useRef(null);
  //Remove delete button and canvas (used for grid) on grid clip.
  const [deleteClicked, setDeleteClicked] = useState(false);
  const gridContext = useContext(GridContext);
  // Dimensions of canvas
  let width = gridContext.dimensions.width;
  let height = gridContext.dimensions.height;
  //Amount of rows and columns in grid.
  let rows = parseInt(gridContext.gridDimensions.rows);
  let cols = parseInt(gridContext.gridDimensions.cols);
  // For creating the grid lines.
  let createdPreviously = gridContext.createdPreviously;
  let setCreatedPreviously = gridContext.setCreatedPreviously;
  //Disable canvas when grid is clipped.
  let displayCanvas = gridContext.displayCanvas;
  let canvasLines = gridContext.canvasLines;
  //Bottom right corner of grid will have a
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // only create out canvas lines if they weren't created yet.
    if (!createdPreviously) {
      createGrid(ctx);
    } else {
      draw(ctx);
    }
  });

  /* create grid and add view */
  const createGrid = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //used to determine how big each line will be for grid.
    const lineSize = 5;
    const lineX = (width - lineSize) / cols;
    const lineY = (height - lineSize) / rows;
    //keep track of the current row/col for easy lookup on drag.
    let currentRow = 0;
    let currentCol = 0;
    //draw columns.
    for (let y = 0; y < height - lineY; y += lineY) {
      currentCol = 0;

      for (let x = 0; x < width; x += lineX) {
        //If the last column we want to make it lineSize larger to account for missing square of size
        //linsizexlinesize in bottom right corner.
        if (currentRow === rows - 1 && currentCol === cols) {
          createLine(
            x,
            y,
            lineSize,
            lineY + lineSize,
            false,
            currentCol++,
            currentRow,
          );
        } else {
          createLine(x, y, lineSize, lineY, false, currentCol++, currentRow);
        }
      }
      currentRow++;
    }

    currentRow = 0;
    //draw rows
    for (let y = 0; y < height; y += lineY) {
      currentCol = 0;
      for (let x = 0; x < width - lineX; x += lineX) {
        //If the last column we want to make it lineSize larger to account for missing square of size
        //linsizexlinesize in bottom right corner.
        if (currentRow === rows && currentCol === cols - 1) {
          createLine(
            x,
            y,
            lineX + lineSize,
            lineSize,
            true,
            currentRow,
            currentCol++,
          );
        } else {
          createLine(x, y, lineX, lineSize, true, currentRow, currentCol++);
        }
      }
      currentRow++;
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

      //oversized flag is used so that gridlines aren't drawn past what they should be.
      //This flag will only be equal to linesize in the last column. The last column and row were
      //enlarged to avoid a missing lineSize X lineSize square.
      let overSized = !isRow && lineHeight > lineY ? lineSize : 0;
      let line = {
        isRow: isRow,
        deleted: false,
        path: path,
        coords: {
          x: x,
          y: y,
          width: lineWidth,
          height: lineHeight,
          overSized: overSized,
        },
        index: index,
        oppositeAxisIndex: oppositeAxisIndex,
        visited: false,
      };
      canvasLines.current.push(line);
    }

    draw(ctx);
    setCreatedPreviously(true);
  };

  /* Update view of grid */
  function draw(ctx) {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = ctx.createPattern(getLinePattern(), "repeat");
    canvasLines.current.forEach((line) => {
      //only draw lines that haven't been deleted
      if (line.deleted === false) {
        ctx.fill(line.path, "nonzero");
      }
    });
  }

  /* Creates a pattern of X's. This is used to fill canvas lines */
  function getLinePattern() {
    var pattern = document.createElement("canvas");
    pattern.width = 3;
    pattern.height = 3;
    var pctx = pattern.getContext("2d");
    pctx.strokeStyle = "black";
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.moveTo(0, 0);
    pctx.lineTo(10, 10);
    pctx.moveTo(0, 10);
    pctx.lineTo(10, 0);
    pctx.stroke();
    return pattern;
  }
  /* Handles deletion of lines for merging cells. */
  const onClickHandler = (e) => {
    if (deleteClicked) {
      const ctx = canvasRef.current.getContext("2d");
      let bounds = canvasRef.current.getBoundingClientRect();
      let x = e.clientX - bounds.left;
      let y = e.clientY - bounds.top;
      for (let i = 0; i < canvasLines.current.length; i++) {
        let currentLine = canvasLines.current[i];
        if (ctx.isPointInPath(currentLine.path, x, y, "nonzero")) {
          //only delete lines that aren't on the ousides of the grid.
          if (!isBoundingLine(currentLine)) {
            // removeImproperLines(currentLine);
            GridDfs(canvasLines, currentLine, rows, cols);
          }
        }
      }
      draw(ctx);
    }
  };

  /* Check if the current line is on the outside of the grid. These 
  lines should always be present */
  function isBoundingLine(currentLine) {
    return currentLine.index !== 0 &&
      ((currentLine.isRow && currentLine.index !== rows) ||
        (!currentLine.isRow && currentLine.index !== cols))
      ? false
      : true;
  }

  /* =============Mouse movements for dragging lines=============*/
  let startX = 0,
    startY = 0,
    gridLines = {
      moving: false,
      current: [],
      shrinking: [],
      expanding: [],
    };
  /* Get starting coordinates of grid element that was clicked. */
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

  /* Handle grid movement. */
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
      <ClipButton />
      <DeleteButton
        buttonClicked={deleteClicked}
        toggle={() => setDeleteClicked(!deleteClicked)}
      />
      <ClipGrid canvasLines={canvasLines.current} />
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
