import React, { useContext, useState } from "react";
import Square from "./Square";
import Card from "./Card";
import "./App.css";
import { GridContext } from "./App";
import Carousel from "react-elastic-carousel";

function ClipGrid({ canvasLines, setDisplayCanvas }) {
  const gridContext = useContext(GridContext);
  let clicked = gridContext.renderCards;
  // let cards = useRef([]);
  const [cards, setCards] = useState([]);
  const [squares, setSquares] = useState([]);

  if (clicked) {
    /* Drawing points are used to determine where to draw boxes. We want to create boxes using the top left coords
     Spanning to the bottom right coords of lines that have collisions. 
     */
    function createCoordinates() {
      const MAX_DIFF = 15;
      //min and max coordinates will always be a drawing point.
      let validCoords = [];
      // cards.current = [];
      let validCols = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === false,
      );

      let validRows = canvasLines.filter(
        (line) => line.deleted === false && line.isRow === true,
      );
      let key = 0;
      for (let i = 0; i < validCols.length; i++) {
        const currentCol = validCols[i];
        let a = containsRow("TOP", currentCol, validRows, MAX_DIFF);
        if (a === true) {
          //if we have a top row we must have a next col on right side.
          let sameIndexCols = validCols.filter(
            (line) =>
              line.index === currentCol.index + 1 &&
              line.coords.y >= currentCol.coords.y,
          );
          let index = 0;
          let nextCol = sameIndexCols[index];
          // //iterate through all cols and keep going while current one doesn't match until we get one that does. then we want
          // //to make that the bottom right corner.
          //----add to check if col and row are deleted then go to next col. if just row is deleted go
          //down, if col is just deleted go right. (grab next rows and next cols)
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
            yEnd: nextCol.coords.y + nextCol.coords.height,
            id: key,
          };
          validCoords.push(dimensions);
          // cards.current.push(dimensions);
          // setSquares([...squares, dimensions]);
          // setCards([...cards, dimensions]);
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

    function removeCardHandler(id) {
      setCards(cards.filter((card) => card.id !== id));
    }

    if (cards.length === 0) {
      createCoordinates();
      setDisplayCanvas(false);
    }
    return (
      <>
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

          // style={
          //   {
          //     // bottom: "-50%",
          //   }
          // }
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
