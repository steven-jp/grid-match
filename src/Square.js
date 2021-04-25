import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

function Square({ id, dimensions }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => validDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  function validDrop(item) {
    if (item.id === id) {
      alert("Correct");
      return { correct: true };
    }
    alert("Incorrect");
    return { correct: false };
  }

  return (
    <div
      className="Square"
      ref={drop}
      // onDrop={(e) => e.stopPropagation()}
      style={{
        backgroundColor: isOver ? "rgb(173,149,149)" : "blue",
        top: dimensions.yStart,
        left: dimensions.xStart,
        height: dimensions.yEnd - dimensions.yStart,
        width: dimensions.xEnd - dimensions.xStart,
      }}
    >
      {/* <h1>x</h1> */}
    </div>
  );
}

export default Square;
