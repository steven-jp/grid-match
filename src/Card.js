import { useContext, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { GridContext } from "./App";

function Card({ id, dimensions }) {
  const [validAnswer, setValidAnswer] = useState(false);
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id },
    end: (item, monitor) => validDrop(monitor),
  }));

  //Check for a matching square.
  function validDrop(monitor) {
    if (monitor.getDropResult()) {
      let correct = monitor.getDropResult().correct;
      if (correct) setValidAnswer(true);
    }
  }
  //get width and height of original image to determine where to show viewbox.
  const gridContext = useContext(GridContext);
  let width = gridContext.imgDimensions.width;
  let height = gridContext.imgDimensions.height;
  let imgBlob = gridContext.imgBlob;
  // console.log(width, height);
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
      //Show specific view of image used in
      <svg
        viewBox={viewBoxValues}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <image
          className="card-image"
          xlinkHref={imgBlob}
          style={{
            width: width,
            height: height,
          }}
        />
      </svg>
    );
  }

  return (
    //height in carousel container.
    <div
      style={{
        maxHeight: "50%",
        maxWidth: "50%",
      }}
    >
      {!validAnswer ? (
        //Card properties
        <div
          ref={drag}
          style={{
            borderRadius: "5px",
            border: "dashed",
            // height: "100%",
            // width: "100%",
          }}
        >
          <DisplayCard />
        </div>
      ) : null}
    </div>
  );
}

export default Card;
