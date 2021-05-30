import { useState } from "react";
function GridForm({ handleGridSubmit }) {
  const [gridDimensions, setGridDimensions] = useState({
    rows: "3",
    cols: "3",
  });

  //update grid dimensions
  function handleGridChange(e) {
    setGridDimensions({
      ...gridDimensions,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form
      className="grid-form"
      onSubmit={(e) =>
        handleGridSubmit(e, gridDimensions.rows, gridDimensions.cols)
      }
    >
      <label htmlFor="grid-row">Rows</label>
      <input
        type="text"
        name="rows"
        className="grid-row"
        value={gridDimensions.rows}
        onChange={handleGridChange}
      />

      <label htmlFor="grid-col">Columns</label>
      <input
        type="text"
        name="cols"
        className="grid-col"
        value={gridDimensions.cols}
        onChange={handleGridChange}
      />
      <input className="submit-button" type="submit" value="Submit" />
    </form>
  );
}

export default GridForm;
