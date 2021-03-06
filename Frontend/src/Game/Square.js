import { useDrop } from "react-dnd";
import { ItemTypes } from "../Game/ItemTypes";

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
      style={{
        backgroundColor: isOver ? "rgb(173,149,149)" : "rgb(68, 86, 187)",
        top: dimensions.yStart,
        left: dimensions.xStart,
        height: dimensions.yEnd - dimensions.yStart,
        width: dimensions.xEnd - dimensions.xStart,
      }}
    ></div>
  );
}

export default Square;
