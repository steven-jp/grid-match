function GridForm({ gridDimensions, handleGridChange, handleGridSubmit }) {
  return (
    <form className="grid-form" onSubmit={handleGridSubmit}>
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
