import axios from "axios";

let URL = "http://localhost:8080/file";

async function downloadFile(id) {
  axios
    .get(URL + "/" + id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
      console.log(error.response);
    });
}

async function uploadFile(id) {
  axios
    .post(URL + "/" + id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
      console.log(error.response);
    });
}

async function deleteFile(id) {
  axios
    .delete(URL + "/" + id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
      console.log(error.response);
    });
}

export { uploadFile, downloadFile, deleteFile };
