import { useContext } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { GridContext } from "./App";

function Card({ id, dimensions, imgBlob }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  //get width and height of original image to determine where to show viewbox.
  const gridContext = useContext(GridContext);
  let width = gridContext.dimensions.width;
  let height = gridContext.dimensions.height;

  function DisplayCard() {
    let viewBoxValues =
      dimensions.xStart +
      " " +
      dimensions.yStart +
      " " +
      (dimensions.xEnd - dimensions.xStart) +
      " " +
      (dimensions.yEnd - dimensions.yStart);

    return (
      <svg viewBox={viewBoxValues}>
        <image
          className="card-image"
          xlinkHref={imgBlob}
          style={{
            width: { width },
            height: { height },
          }}
        />
      </svg>
    );
  }

  return (
    <div
      ref={drag}
      style={{
        display: "inline-block",
        backgroundColor: "red",
        top: dimensions.yStart,
        left: dimensions.xStart,
        height: dimensions.yEnd - dimensions.yStart,
        width: dimensions.xEnd - dimensions.xStart,
        // zIndex: 555,
        // position: "relative",
      }}
    >
      <DisplayCard />
    </div>
  );
}

export default Card;
