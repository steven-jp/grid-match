import {
  Container,
  Button,
  makeStyles,
  ImageList,
  ImageListItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getFiles, uploadFile, deleteFile } from "../Components/Files/Api";
import ClipGrid from "../Game/ClipGrid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    marginTop: "50px",
  },
  gridElement: {
    margin: "100px",
  },
}));

const Recent = () => {
  const classes = useStyles();
  const [userFiles, setUserFiles] = new useState([]);

  useEffect(() => {
    getFiles(setUserFiles);
  }, [setUserFiles]);

  return (
    <>
      <div className={classes.root}>
        <Container maxWidth="md">
          <h1>Recent page</h1>
          <Button
            color="primary"
            style={{ textTransform: "none" }}
            onClick={() => getFiles(setUserFiles)}
          >
            --- TESTER ---
          </Button>
          {userFiles ? (
            <ImageList rowHeight={300} className={classes.gridElement}>
              {userFiles.map((url, count) => (
                <ImageListItem key={count}>
                  <img src={url} alt={"Image" + count} />;
                </ImageListItem>
              ))}
            </ImageList>
          ) : null}
        </Container>
      </div>
    </>
  );
};

export default Recent;
