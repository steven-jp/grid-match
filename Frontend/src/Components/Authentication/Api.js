import axios from "axios";

let URL = "http://localhost:8080";

async function createUser(user) {
  axios
    .post(URL + "/user/register", {
      email: user.email,
      password: user.password,
      confirmedPassword: user.confirmedPassword,
    })
    .then((res) => {
      // if (res.status === 200) {
      //   window.location.assign("/login");
      // }
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function loginUser(user) {
  axios
    .post(
      URL + "/user/login",
      {
        email: user.email,
        password: user.password,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    )
    .then((res) => {
      console.log(res);
      let token = res.headers["authorization"];
      console.log(token);
      if (res.status === 200 && token) {
        localStorage.setItem("token", token);
        window.location.assign("/");
      }
    })
    .catch((error) => {
      console.log(error.response);
    });
}

function isLoggedIn(setLogged = null) {
  axios
    .get(URL + "/user", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      console.log(res.data);
      if (setLogged != null) {
        setLogged(true);
      }
      return res;
    })
    .catch((error) => {
      console.log(error);
      if (setLogged != null) {
        setLogged(false);
      }
      return error;
    });
}

export { createUser, loginUser, isLoggedIn };
