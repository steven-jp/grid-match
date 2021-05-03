import { useContext, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { GridContext } from "./App";

function Card({ id, dimensions, removeCardHandler }) {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id },
    end: (item, monitor) => validDrop(monitor),
  }));

  //Check for a matching square.
  function validDrop(monitor) {
    if (monitor.getDropResult()) {
      let correct = monitor.getDropResult().correct;
      if (correct) removeCardHandler(id);
    }
  }

  //size of image on screen
  const gridContext = useContext(GridContext);
  let width = gridContext.imgDimensions.width;
  let height = gridContext.imgDimensions.height;
  let imgBlob = gridContext.imgBlob;

  //card ref and size.
  let imageWidth = dimensions.xEnd - dimensions.xStart;
  let imageHeight = dimensions.yEnd - dimensions.yStart;
  const cardCanvas = useRef(null);

  useEffect(() => {
    const ctx = cardCanvas.current.getContext("2d");
    var img = new Image();
    img.src = imgBlob;

    img.onload = function () {
      //Get scaling of img. Lines will correspond to scaled image whereas img will correspond to
      // the full imageblob size.
      let scaleX = img.width / width;
      let scaleY = img.height / height;

      //clip image to fit card dimensions.
      ctx.drawImage(
        img,
        dimensions.xStart * scaleX,
        dimensions.yStart * scaleY,
        imageWidth * scaleX,
        imageHeight * scaleY,
        0,
        0,
        imageWidth,
        imageHeight,
      );
    };
  });

  return (
    <div ref={drag}>
      <canvas ref={cardCanvas} width={imageWidth} height={imageHeight}></canvas>
    </div>
  );
}

export default Card;
