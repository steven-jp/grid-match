import axios from "axios";

let URL = "http://localhost:8080/file";

async function getFile(id) {
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

async function uploadFile(formData) {
  axios
    // .post(URL + "/" + id, {
    .post(URL, formData, {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
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

async function deleteFile(key) {
  axios
    .delete(URL + "/" + key, {
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

export { uploadFile, getFile, deleteFile };
