// import "./Square.css";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Square({ id }) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => validDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  function validDrop(item) {
    if (item.id === id) {
      console.log("true");
    } else {
      console.log("false");
    }
  }

  return (
    <div
      ref={drop}
      style={{
        display: "inline-block",
        backgroundColor: isOver ? "green" : "blue",
        height: "100px",
        width: "100px",
        zIndex: "1",
      }}
    >
      <h1>Square</h1>
    </div>
  );
}

export default Square;
