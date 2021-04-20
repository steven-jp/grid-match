import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Square({ id, dimensions }) {
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
      // onDrop={(e) => e.stopPropagation()}
      style={{
        display: "inline-block",
        backgroundColor: isOver ? "green" : "blue",
        top: dimensions.yStart,
        left: dimensions.xStart,
        height: dimensions.yEnd - dimensions.yStart,
        width: dimensions.xEnd - dimensions.xStart,
        zIndex: 500,
        position: "absolute",
      }}
    >
      <h1>Square</h1>
    </div>
  );
}

export default Square;
