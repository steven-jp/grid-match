import { useContext } from "react";
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
  //get width and height of original image to determine where to show viewbox.
  const gridContext = useContext(GridContext);
  let width = gridContext.imgDimensions.width;
  let height = gridContext.imgDimensions.height;
  let imgBlob = gridContext.imgBlob;
  function DisplayCard() {
    let viewBoxValues =
      dimensions.xStart +
      " " +
      dimensions.yStart +
      " " +
      (dimensions.xEnd - dimensions.xStart) +
      " " +
      (dimensions.yEnd - dimensions.yStart);

    // determine what to expand to keep same aspect ratio.

    let svgStyles = {};
    let cardWidthRatio = dimensions.xEnd - dimensions.xStart;
    let cardHeightRatio = dimensions.yEnd - dimensions.yStart;
    cardWidthRatio > cardHeightRatio
      ? (svgStyles.width = "100%")
      : (svgStyles.height = "100%");
    svgStyles.width = "";

    // let parentWidth = 1,
    //   parentHeight = 1;
    // //how much do i expand the highest percentage difference to make the smallest fit.
    // let svgStyles = {};
    // let cardWidthRatio = parentWidth / (dimensions.xEnd - dimensions.xStart);
    // let cardHeightRatio = parentHeight / (dimensions.yEnd - dimensions.yStart);
    // cardWidthRatio > cardHeightRatio
    //   ? (svgStyles.width = "100%")
    //   : (svgStyles.height = "100%");
    // svgStyles.width = "";

    return (
      //Show specific view of image used in
      <svg
        viewBox={viewBoxValues}
        // style={
        //   {
        //     // maxWidth: "100%",
        //     // height: "auto",
        //     // maxWidth: "100%",
        //     // maxHeight: "100%",
        //   }
        // }
        style={svgStyles}
      >
        {/* <rect x="0" y="0" width="100%" height="100%" fill="#FEDA00"></rect> */}
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
    <>
      {/* {!validAnswer ? ( */}
      {/* //Card properties */}
      <div
        ref={drag}
        style={{
          // borderRadius: "5px",
          // border: "dashed",
          height: "50%",
          width: "50%",

          // maxWidth: "100%",
          // maxHeight: "100%",
        }}
      >
        <DisplayCard />
      </div>
      {/* ) : undefined} */}
    </>
  );
}

export default Card;
