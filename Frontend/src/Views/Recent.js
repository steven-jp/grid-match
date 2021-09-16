import { Container, Button } from "@material-ui/core";
import React from "react";
import { downloadFile, uploadFile } from "../Components/Files/Api";

const Recent = () => {
  return (
    <>
      <Container maxWidth="sm">
        <Button
          color="primary"
          style={{ textTransform: "none" }}
          onClick={() => downloadFile(1234)}
        >
          --- TESTER ---
        </Button>
      </Container>
      <h1>Recent page</h1>
    </>
  );
};

export default Recent;
