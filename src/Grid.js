import React, { useRef, useState, useEffect, useContext } from "react";
import DeleteButton from "./buttons/DeleteButton";
import ClipButton from "./buttons/ClipButton";
import ClipGrid from "./ClipGrid";
import { GridContext } from "./App";

function Grid() {
  // to get context of canvas.
  const canvasRef = useRef(null);
  //Remove delete button and canvas (used for grid) on grid clip.
  const [deleteClicked, setDeleteClicked] = useState(false);
  // const [displayCanvas, setDisplayCanvas] = useState(true);
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

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // only create out canvas lines if they weren't created yet.
    if (!createdPreviously) {
      createGrid(ctx);
    } else {
      draw(ctx);
    }
  }, [canvasRef]);

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
      if (currentCol === cols) {
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
        rows,
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
  //handles deletion of lines for merging cells.
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
            currentLine.deleted = true;
            removeImproperLines(currentLine);
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

  /*All lines that don't have two opposite lines will be deleted unless the line
    is a part of the grid bounds. If a line is deleted we want to make sure 
    we only have lines that make up a rectangle.
    EX: If there is a row without it's current and previous column then it's
    determined to be an improper line and will be deleted. This may cause another
    line to be improper so we want to continue checking until all lines are valid. 
  */
  function removeImproperLines(deletedLine) {
    let validLines = canvasLines.current.filter(
      (line) => line.deleted === false,
    );
    // format into a coordinates array. This will allow quicker lookup for line removal.
    // Each coordinate will have a reference to maximum 4 lines that intersect. Once deleted,
    // original canvas array will contain deletion.
    let lineCoords = initArray();
    console.log(lineCoords);
    validLines.forEach((line, i) => {
      let [row, col] = getCoordinatesOfLine(line);
      if (line.isRow) {
        lineCoords[row][col] = { ...lineCoords[row][col], right: line };
        if (col < cols) {
          lineCoords[row][col + 1] = {
            ...lineCoords[row][col + 1],
            left: line,
          };
        }
      } else {
        lineCoords[row][col] = { ...lineCoords[row][col], bottom: line };
        if (row < rows) {
          lineCoords[row + 1][col] = {
            ...lineCoords[row + 1][col],
            top: line,
          };
        }
      }
    });

    //DFS on each coordinate that hasn't been deleted and set the lines to deleted that won't be drawn.
    improperLineDFS(lineCoords, deletedLine);
  }
  /* This function returns the coordinates of a given line */
  function getCoordinatesOfLine(currentLine) {
    return currentLine.isRow
      ? [currentLine.index, currentLine.oppositeAxisIndex]
      : [currentLine.oppositeAxisIndex, currentLine.index];
  }
  /* This function deletes all improper lines by doing a DFS */
  function improperLineDFS(coords, line) {
    if (line === undefined || line.deleted) {
      return;
    }
    let [row, col] = getCoordinatesOfLine(line);

    //Check if the current line is a row and doesn't contain proper bounding columns or if it's
    // a column and doesn't contain bounding rows;
    if (
      (line.isRow &&
        (coords[row][col].top.deleted || coords[row][col].bottom.deleted)) ||
      (!line.isRow &&
        (coords[row][col].left.deleted || coords[row][col].right.deleted))
    ) {
      let nextRow = row,
        nextCol = col;
      if (line.isRow && validCoord(coords, row + 1, col)) {
        nextRow++;
      }
      if (!line.isRow && validCoord(coords, row, col + 1)) {
        nextCol++;
      }
      //Get current and next index lines to traverse. Values that weren't previously
      // deleted will only be checked.
      let [top, bottom, right, left] = deleteAllLines(coords, row, col);
      let [nextTop, nextBottom, nextRight, nextLeft] = deleteAllLines(
        coords,
        nextRow,
        nextCol,
      );
      improperLineDFS(coords, top);
      improperLineDFS(coords, bottom);
      improperLineDFS(coords, right);
      improperLineDFS(coords, left);
      improperLineDFS(coords, nextTop);
      improperLineDFS(coords, nextBottom);
      improperLineDFS(coords, nextRight);
      improperLineDFS(coords, nextLeft);
    }
  }

  /* Deletes all of the lines at a given coordinate and returns an array of previous deleted values. 
  This is used to determine if we should DFS a given direction and prevents us from traversing the same 
  line twice. */

  function deleteAllLines(coords, row, col) {
    let top, bottom, right, left;
    if (top) {
      top = coords[row][col].top.deleted;
      coords[row][col].top.deleted = true;
    }
    if (bottom) {
      bottom = coords[row][col].bottom.deleted;
      coords[row][col].bottom.deleted = true;
    }
    if (right) {
      right = coords[row][col].right.deleted;
      coords[row][col].right.deleted = true;
    }
    if (left) {
      left = coords[row][col].left.deleted;
      coords[row][col].left.deleted = true;
    }

    return [top, bottom, right, left];
  }

  // only visit coordinates that are in bounds */
  function validCoord(row, col) {
    return row <= rows && row >= 0 && col <= cols && cols >= 0 ? true : false;
  }

  function initArray() {
    let res = [];
    for (let i = 0; i <= rows; i++) {
      res[i] = [];
      for (let j = 0; j <= cols; j++) {
        res[i][j] = { top: null, bottom: null, right: null, left: null };
      }
    }
    return res;
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
