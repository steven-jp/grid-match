import "./App.css";
import React, { useState, useEffect, useRef, createContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "./Grid";
import GridForm from "./GridForm";

// fix bug with dropping multiple images. re brings up the forms

export const GridContext = createContext();

function App() {
  const myRef = useRef(null);
  const MAX_GRID_DIMS = 20;

  //Passed globally for grid creation
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // const [gridDimensions, setGridDimensions] = useState({ rows: "", cols: "" });
  const [gridDimensions, setGridDimensions] = useState({
    rows: "3",
    cols: "3",
  });
  const [showImage, setShowImage] = useState(false); // show image before grid form. hide after clipping.
  const [renderCards, setRenderCards] = useState(false); // used to render cards after clip grid button pressed.
  const [renderButtons, setRenderButtons] = useState({
    delete: true,
    clip: true,
  });
  const [maxWidth, setMaxWidth] = useState(dimensions.width);
  const [maxHeight, setMaxHeight] = useState(dimensions.height);
  const [minWidth, setMinWidth] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [createdPreviously, setCreatedPreviously] = useState(false);
  const canvasLines = useRef([]);

  // This components hooks
  const [renderForm, setRenderForm] = useState(false); // Renders user input for grid.
  const [renderGrid, setRenderGrid] = useState(false); //displays grid if we have user input

  //Global variables object
  const ContextValue = {
    renderCards: renderCards,
    showImage: showImage,
    gridDimensions: gridDimensions, //.width, .height
    dimensions: dimensions, // .rows, .cols
    renderButtons: renderButtons, //.clip, .grid
    maxWidth: maxWidth,
    setMaxWidth: setMaxWidth,
    maxHeight: maxHeight,
    setMaxHeight: setMaxHeight,
    minWidth: minWidth,
    setMinWidth: setMinWidth,
    minHeight: minHeight,
    setMinHeight: setMinHeight,
    createdPreviously: createdPreviously,
    setCreatedPreviously: setCreatedPreviously,
    canvasLines: canvasLines,
  };

  //dimensions of image
  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
      });
      setMaxWidth(myRef.current.offsetWidth);
      setMaxHeight(myRef.current.offsetHeight);
    }
    //Check if we resize image and remove on cleanup
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  //Update rows and cols when user inputs values
  function handleGridSubmit(e) {
    e.preventDefault();
    let rows = gridDimensions.rows;
    let cols = gridDimensions.cols;
    // Check if value is between 1 and max and contains only numbers (/[^0-9]+)/
    if (
      rows.match(/[^0-9]+/) ||
      rows.length > 2 ||
      rows < 1 ||
      rows > MAX_GRID_DIMS ||
      cols.match(/[^0-9]+/) ||
      cols.length > 2 ||
      cols < 1 ||
      cols > MAX_GRID_DIMS
    ) {
      alert(`Please enter a grid size between 1 and ${MAX_GRID_DIMS}`);
      setGridDimensions({
        rows: "",
        cols: "",
      });
    } else {
      setRenderGrid(true);
      setRenderForm(false);
    }
  }
  function handleGridChange(e) {
    setGridDimensions({
      ...gridDimensions,
      [e.target.name]: e.target.value,
    });
  }

  //Handle image uploads to main-grid.
  const [file, setFile] = useState(null);
  const [text, setText] = useState("Drag Image Here");
  const fileUpload = (e) => {
    e.preventDefault();
    let files = e.dataTransfer.files;
    //handle if drop isn't an image
    if (files[0] && files[0].type.startsWith("image")) {
      setFile(URL.createObjectURL(files[0]));
      setText("");
      setRenderForm(true);
      setShowImage(true);
    }
  };

  function AddGrid() {
    if (renderGrid === true) {
      return <Grid imgBlob={file} renderGridHandler={renderGridHandler} />;
    }
    return null;
  }
  function AddGridForm() {
    if (renderForm === true) {
      return (
        <GridForm
          gridDimensions={gridDimensions}
          handleGridChange={handleGridChange}
          handleGridSubmit={handleGridSubmit}
        />
      );
    }
    return null;
  }
  function AddUserImage() {
    // if (showImage === true) {
    return <img className="user-image" src={file} alt="" />;
    // }
    // return null;
  }

  //child component calls this to remove image from grid. We set '
  // We do this to display image on drop before grid form is displayed.
  function renderGridHandler() {
    console.log("clicked");
    setShowImage(false);
    setRenderCards(true);
    setRenderButtons(false);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div
          ref={myRef}
          className="main-grid"
          onDrop={fileUpload}
          onDragOver={(e) => e.preventDefault()}
          style={{
            backgroundColor: file ? "transparent" : "rgb(72, 72, 72)",
          }}
        >
          <AddUserImage />
          <h1>{text}</h1>
          <GridContext.Provider value={ContextValue}>
            <AddGridForm />
            <AddGrid draggable="true" />
          </GridContext.Provider>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
