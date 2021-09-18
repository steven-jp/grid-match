import { Container, Button } from "@material-ui/core";
import React from "react";
import { getFile, uploadFile, deleteFile } from "../Components/Files/Api";

const Recent = () => {
  return (
    <>
      <Container maxWidth="sm">
        <Button
          color="primary"
          style={{ textTransform: "none" }}
          onClick={() =>
            deleteFile("1631999089447Screen Shot 2021-06-28 at 12.33.11 PM.png")
          }
        >
          --- TESTER ---
        </Button>
      </Container>
      <h1>Recent page</h1>
    </>
  );
};

export default Recent;
