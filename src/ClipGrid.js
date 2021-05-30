import React, { useContext } from "react";
import Square from "./Square";
import Card from "./Card";
import "./App.css";
import { GridContext } from "./App";
import Carousel from "react-elastic-carousel";
import ReplayButton from "./buttons/ReplayButton";
import Score from "./Score";

function ClipGrid({ canvasLines, xLength, yLength }) {
  const gridContext = useContext(GridContext);
  let clicked = gridContext.renderCards;
  let cards = gridContext.cards;
  let setCards = gridContext.setCards;
  let squares = gridContext.squares;
  let setSquares = gridContext.setSquares;
  let scoreDispatch = gridContext.scoreDispatch;

  if (clicked) {
    /* Drawing points are used to determine where to draw boxes. We want to create boxes using the top left coords
     Spanning to the bottom right coords of lines that have collisions. At this point there will only be a box 
     due to the delete function removing all improper lines. 
     */
    function createCoordinates() {
      const MAX_DIFF = 15;
      //min and max coordinates will always be a drawing point.
      let validCoords = [];
      let validCols = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === false,
      );

      let validRows = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === true,
      );

      let key = 0;
      for (let i = 0; i < validCols.length; i++) {
        const currentCol = validCols[i];
        if (containsRow("TOP", currentCol, validRows, MAX_DIFF)) {
          //If we have a top row we must have a next col on right side.

          //Get all possible columns that can be a bottom right.
          let sameIndexCols = validCols.filter(
            (line) =>
              line.index >= currentCol.index + 1 &&
              line.coords.y >= currentCol.coords.y,
          );
          //The next column available will be the one we want to traverse.
          //Only check columns with this index.
          let index = 0;
          let nextCol = sameIndexCols[index];
          sameIndexCols = sameIndexCols.filter(
            (line) => line.index === nextCol.index,
          );
          //Check next available column to get the first bottom right corner.
          while (
            containsRow("BOTTOM", nextCol, validRows, MAX_DIFF) === false
          ) {
            index++;
            nextCol = sameIndexCols[index];
          }
          let dimensions = {
            xStart: currentCol.coords.x,
            yStart: currentCol.coords.y,
            xEnd: nextCol.coords.x,
            yEnd:
              nextCol.coords.y +
              nextCol.coords.height -
              nextCol.coords.overSized,
            id: key,
          };
          validCoords.push(dimensions);
          key++;
        }
      }
      setSquares(validCoords);
      const cardCoords = [...validCoords];
      shuffle(cardCoords);
      setCards(cardCoords);
    }

    function containsRow(rowType, currentCol, rows, MAX_DIFF) {
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
        //checking bottom right corner
        if (rowType === "BOTTOM") {
          let xDiff = Math.abs(
            currentRow.coords.x +
              currentRow.coords.width -
              (currentCol.coords.x + currentCol.coords.width),
          );

          let yDiff = Math.abs(
            currentRow.coords.y +
              currentRow.coords.height -
              (currentCol.coords.y + currentCol.coords.height),
          );

          if (xDiff <= MAX_DIFF && yDiff <= MAX_DIFF) {
            return true;
          }
        }
      }

      return false;
    }

    //remove card if matched
    function removeCardHandler(id) {
      setCards(cards.filter((card) => card.id !== id));
    }

    //set scores to 0 and reset cards.
    function replayHandler() {
      setCards([]);
      scoreDispatch({ type: "RESET" });
      alert("The current game has been replayed");
    }

    //only recreate cards if empty or haven't been initialized.
    if (cards.length === 0) {
      createCoordinates();
    }
    return (
      <>
        <ReplayButton replayHandler={replayHandler} />
        <Score />
        {squares.map((coordinate) => {
          const dimensions = {
            xStart: coordinate.xStart,
            yStart: coordinate.yStart,
            xEnd: coordinate.xEnd,
            yEnd: coordinate.yEnd,
          };
          return (
            <Square
              key={coordinate.id}
              id={coordinate.id}
              dimensions={dimensions}
            />
          );
        })}
        <Carousel
          itemsToShow={1}
          itemsToScroll={1}
          itemPadding={[10]}
          enableSwipe={false}
        >
          {cards.map((coordinate) => {
            const dimensions = {
              xStart: coordinate.xStart,
              yStart: coordinate.yStart,
              xEnd: coordinate.xEnd,
              yEnd: coordinate.yEnd,
            };
            return (
              <Card
                key={coordinate.id}
                id={coordinate.id}
                dimensions={dimensions}
                removeCardHandler={removeCardHandler}
              ></Card>
            );
          })}
        </Carousel>
      </>
    );
  }
  return null;
}

// Fischer Yates Shuffle
function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
}

export default ClipGrid;
