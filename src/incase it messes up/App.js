import "./App.css";
import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Square from "./Square";
import Card from "./Card";
import Grid from "./Grid";

function App() {
  //Handle dimensions. We want grid to size to it.
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const myRef = useRef(null);
  useEffect(() => {
    setDimensions({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    });
  }, [myRef]);

  //Handle image uploads to main-grid.
  const [file, setFile] = useState();
  const [text, setText] = useState("Drag Image Here");
  const fileUpload = (e) => {
    e.preventDefault();
    let files = e.dataTransfer.files;
    //handle if drop isn't an image
    if (files[0] && files[0].type.startsWith("image")) {
      URL.createObjectURL(files[0]);
      setFile(URL.createObjectURL(files[0]));
      setText("");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div
          ref={myRef}
          className="main-grid"
          onDrop={fileUpload}
          style={{
            backgroundColor: file ? "transparent" : "rgb(72, 72, 72)",
          }}
        >
          <h1>{text}</h1>
          <img src={file} alt="" />
          <Grid width={dimensions.width} height={dimensions.height} />
          <Square id="1" width={dimensions.width} height={dimensions.height} />
          <Card id="1" width={dimensions.width} height={dimensions.height} />
        </div>

        {/* <MainGrid /> */}
      </div>
      {/* </div> */}
    </DndProvider>
  );
}

export default App;
