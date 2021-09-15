import React, { useState } from "react";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Container,
} from "@material-ui/core";
import {
  createUser,
  // isLoggedIn,
  loginUser,
} from "../Components/Authentication/Api";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgba(219, 213, 212,.5)",
    borderRadius: "5px",
    textAlign: "center",
    minHeight: "60vh",
    boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.4)",
  },
}));

const Login = () => {
  const [login, setLogin] = useState(true);
  const classes = useStyles();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
  });

  function changeHandler(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function registerHandler(e) {
    createUser(user);
  }
  function loginHandler(e) {
    loginUser(user);
  }
  return (
    <Container maxWidth="sm" className={classes.root}>
      <h1>Login</h1>
      {login ? (
        <Grid container direction="column">
          <TextField
            label="Email"
            name="email"
            value={user.email}
            InputLabelProps={{ required: true }}
            onChange={changeHandler}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={user.password}
            InputLabelProps={{ required: true }}
            onChange={changeHandler}
          />
          <Button type="login" variant="contained" onClick={loginHandler}>
            Login
          </Button>
          <p>
            Not a user?
            <Button
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => setLogin(!login)}
            >
              Register
            </Button>
          </p>
        </Grid>
      ) : (
        <Grid container direction="column">
          <TextField
            label="Email"
            name="email"
            value={user.email}
            InputLabelProps={{ required: true }}
            onChange={changeHandler}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={user.password}
            InputLabelProps={{ required: true }}
            onChange={changeHandler}
          />
          <TextField
            label="Confirm Password"
            name="confirmedPassword"
            type="password"
            value={user.confirmedPassword}
            InputLabelProps={{ required: true }}
            onChange={changeHandler}
          />
          <Button type="login" variant="contained" onClick={registerHandler}>
            Submit
          </Button>
          <p>
            Already have an account?
            <Button
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => setLogin(!login)}
            >
              Login
            </Button>
          </p>
        </Grid>
      )}
      {/* <Button
        color="primary"
        style={{ textTransform: "none" }}
        onClick={() => isLoggedIn()}
      >
        --- TESTER ---
      </Button> */}
    </Container>
  );
};

export default Login;
