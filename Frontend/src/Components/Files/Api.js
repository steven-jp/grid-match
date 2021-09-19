import axios from "axios";

let URL = "http://localhost:8080/file";

async function getFiles(setUserFiles) {
  let fileNames;
  let files = [];

  //get all the file keys for a user
  axios
    .get(URL, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    //for all the user files, get the array buffers and create a object URL.
    .then((res) => {
      fileNames = res.data;
    })
    .then((res) => {
      let promises = [];

      //Get all arraybuffers in form of promises
      fileNames.forEach((key) => {
        let currentPromise = getFile(key);
        promises.push(currentPromise);
      });

      //wait for all the promises before creating blob from arraybuffer.
      Promise.all(promises)
        .then((promisedFiles) => {
          promisedFiles.forEach((file) => {
            files.push(window.URL.createObjectURL(new Blob([file])));
          });
        })
        //Add to state
        .then(() => {
          setUserFiles(files);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getFile(key) {
  return new Promise((resolve, reject) => {
    axios
      .get(URL + "/" + key, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        responseType: "arraybuffer",
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

export { uploadFile, getFiles, deleteFile };
