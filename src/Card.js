// import "./Square.css";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Card({ id }) {
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
        height: "100px",
        width: "100px",
        zIndex: "2",
      }}
    >
      <h1>Card</h1>
    </div>
  );
}

export default Card;
