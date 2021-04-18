// import "./Square.css";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Card({ id, dimensions }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        display: "inline-block",
        backgroundColor: "red",
        // height: "100px",
        // width: "100px",
        top: dimensions.yStart,
        left: dimensions.xStart,
        height: dimensions.yEnd - dimensions.yStart,
        width: dimensions.xEnd - dimensions.xStart,
        zIndex: "2",
      }}
    >
      <h1>Card</h1>
    </div>
  );
}

export default Card;
