/*
This Function ensures the grid only contains rectangles. All lines that don't 
have two opposite lines will be deleted unless a part of the grid bounds. 

    EX: The invalid grid has a non rectangle shape so the bottom 
    right box will need to be deleted.
        Valid           Invalid      Invalid shape
        |_|_|           |_|_|            ___
        |_|_|           |  _|           |  _|        
        |_|_|           |_|_|           |_| 

    If there is a row without it's current and previous column then it's
    determined to be an improper line and will be deleted. This may cause another
    line to be improper so we want to continue checking until all lines are valid. */

export function GridDfs(canvasLines, deletedLine, rows, cols) {
  /* Starting point of DFS */
  function removeImproperLines() {
    let validLines = canvasLines.current.filter(
      (line) => line.deleted === false,
    );
    /* Format into a coordinates array. This will allow quicker lookup for line removal.
       Each coordinate will have a reference to maximum 4 lines that intersect. Once deleted,
       original canvas array will contain deletion. */
    let lineCoords = initArray();
    validLines.forEach((line) => {
      let [row, col] = getCoordinatesOfLine(line);
      line.visited = false;
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
    deletedLine.deleted = true;

    //DFS on current line.
    improperLineDFS(lineCoords, deletedLine);
  }

  /* This function deletes all improper lines by doing a DFS. We only 
  traverse lines that have the deleted flag and haven't been visited. 
  Each line deleted can come in contact with 6 other lines (3 at a given coord 
  and 3 at end). 
            _|_|_           
             | |        */
  function improperLineDFS(coords, line) {
    //Only check lines that have been deleted and not visited.
    if (line === null || line === undefined || !line.deleted || line.visited) {
      return;
    }
    let [row, col] = getCoordinatesOfLine(line);

    //Check current coordinate lines
    checkCoords(coords, line);

    //Check next coordinate lines
    if (line.isRow && validCoord(row, col + 1)) {
      checkCoords(coords, coords[row][col + 1].left, 0, 1);
    }
    if (!line.isRow && validCoord(row + 1, col)) {
      checkCoords(coords, coords[row + 1][col].top, 1, 0);
    }
  }

  /* This function returns the coordinates of a given line. It takes
  a canvas line and an optional row or column. The optional values are used
  to grab a coordinate with rows or cols greater */
  function getCoordinatesOfLine(currentLine, row = 0, col = 0) {
    return currentLine.isRow
      ? [currentLine.index + row, currentLine.oppositeAxisIndex + col]
      : [currentLine.oppositeAxisIndex + row, currentLine.index + col];
  }

  /*This is a helper function for improperLineDFS to avoid duplicate logic. 
    This is called at most twice by the coordinate at the beginning and end of a line.
    If in an invalid state it deletes all lines and then traverses the rest for each coordinate. */
  function checkCoords(coords, line, incremRow = 0, incremCol = 0) {
    if (line === null) {
      return;
    }
    let [row, col] = getCoordinatesOfLine(line, incremRow, incremCol);
    let top = coords[row][col].top;
    let bottom = coords[row][col].bottom;
    let right = coords[row][col].right;
    let left = coords[row][col].left;

    line.visited = true;
    //Only delete lines if they have any bounds missing.
    if (
      (line.isRow &&
        (top === null || top.deleted || bottom === null || bottom.deleted)) ||
      (!line.isRow &&
        (left === null || left.deleted || right === null || right.deleted))
    ) {
      //Get and delete lines at coordinate
      let [top, bottom, right, left] = deleteAllLines(coords, row, col);

      //Check all the lines of a given coordinate except the current path.
      if (line !== top) improperLineDFS(coords, top);
      if (line !== bottom) improperLineDFS(coords, bottom);
      if (line !== right) improperLineDFS(coords, right);
      if (line !== left) improperLineDFS(coords, left);
    }
  }

  /* Deletes all of the lines at a given coordinate and returns an array of previous deleted values. 
  This is used to determine if we should DFS a given direction and prevents us from traversing the same 
  line twice. */
  function deleteAllLines(coords, row, col) {
    let top, bottom, right, left;
    if (coords[row][col].top) {
      top = coords[row][col].top;
      coords[row][col].top.deleted = true;
    }
    if (coords[row][col].bottom) {
      bottom = coords[row][col].bottom;
      coords[row][col].bottom.deleted = true;
    }
    if (coords[row][col].right) {
      right = coords[row][col].right;
      coords[row][col].right.deleted = true;
    }
    if (coords[row][col].left) {
      left = coords[row][col].left;
      coords[row][col].left.deleted = true;
    }
    // coords[row][col].visited = true;
    return [top, bottom, right, left];
  }

  /* only visit coordinates that are in bounds. Coordinates on the outsides
   aren't valid since they cannot be deleted */
  function validCoord(row, col) {
    return row < rows && row >= 0 && col < cols && cols >= 0 ? true : false;
  }

  function initArray() {
    let res = [];
    for (let i = 0; i <= rows; i++) {
      res[i] = [];
      for (let j = 0; j <= cols; j++) {
        res[i][j] = {
          top: null,
          bottom: null,
          right: null,
          left: null,
          visited: false,
        };
      }
    }
    return res;
  }

  removeImproperLines();
}
