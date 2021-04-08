import "./App.css";
import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "./Grid";
import GridForm from "./GridForm";

// fix bug with dropping multiple images. re brings up the forms

function App() {
  const MAX_GRID_DIMS = 20;
  const myRef = useRef(null);
  //Handle dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // const [gridDimensions, setGridDimensions] = useState({ rows: "", cols: "" });
  const [gridDimensions, setGridDimensions] = useState({
    rows: "3",
    cols: "3",
  });

  const [renderGridForm, setRenderGridForm] = useState(false);
  const [renderGrid, setRenderGrid] = useState(false);

  //dimensions of image
  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
      });
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
      setRenderGridForm(false);
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
      setRenderGridForm(true);
    }
  };

  function AddGrid() {
    if (renderGrid === true) {
      return (
        <Grid
          width={dimensions.width}
          height={dimensions.height}
          rows={gridDimensions.rows}
          cols={gridDimensions.cols}
          imgBlob={file}
        />
      );
    }
    return null;
  }
  function AddGridForm() {
    if (renderGridForm === true) {
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
          <h1>{text}</h1>
          <img className="user-image" src={file} alt="" />
          <AddGridForm />
          <AddGrid draggable="true" />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
