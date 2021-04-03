import React, { useRef, useEffect } from "react";
// const canvas = document.getElementById("main-game");

function Grid({ width, height }) {
  let row = 5,
    col = 5;
  //   let width = 400;
  //   let height = 400;
  const canvasRef = useRef(null);
  let canvasLines = [];

  useEffect(() => {
    // const canvas = canvasRef.current;
    // canvasLines = [];
    const ctx = canvasRef.current.getContext("2d");
    console.log("abbbbb");
    // draw(ctx);
  }, [canvasRef]);

  const draw = (ctx) => {
    ctx.beginPath();
    const lineX = Math.ceil(width / col);
    const lineY = Math.ceil(height / row);

    //draw columns
    for (let x = 0; x <= width; x += lineX) {
      for (let y = 0; y <= height; y += lineY) {
        let colLine = new Path2D();
        let rowLine = new Path2D();

        colLine.moveTo(x, y);
        colLine.lineTo(x, y + lineY);
        ctx.stroke(colLine);

        rowLine.moveTo(x, y);
        rowLine.lineTo(x + lineX, y);
        ctx.stroke(rowLine);
        // colLine.addeven
        // canvasLines.push({click: colLine);
        canvasLines.push(rowLine);
      }
    }

    //draw rows
    for (let x = 0; x < width; x += lineX) {
      for (let y = 0; y < height; y += lineY) {
        let line = new Path2D();
        canvasLines.push(line);

        line.moveTo(x, y);
        line.lineTo(x + lineX, y);

        ctx.stroke(line);
      }
    }
  };

  const onClickHandler = (e) => {
    // const ctx = canvasRef.current.getContext("2d");
    // canvasLines.forEach((line) => {
    //   console.log(ctx.isPointInPath(line, e.offsetX, e.offsetY));
    // });
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    draw(ctx);
  };

  return (
    <canvas
      ref={canvasRef}
      className="Grid"
      width={width}
      height={height}
      onClick={onClickHandler}
    ></canvas>
  );
}

export default Grid;
