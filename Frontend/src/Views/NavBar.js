import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn } from "../Components/Authentication/Api";

const useStyles = makeStyles((theme) => ({
  nav: {
    backgroundColor: "rgb(89, 89, 89)",
    height: "5vh",
  },
  links: {
    height: "100%",
    color: "white",
    textDecoration: "none",
    marginLeft: "10px",
    marginTop: "5px",
    border: "1px double black",
  },
}));

const NavBar = () => {
  const classes = useStyles();

  const [logged, setLogged] = useState(null);

  useEffect(() => {
    isLoggedIn(setLogged);
  }, [setLogged]);

  function logoutHandler() {
    localStorage.removeItem("token");
    window.location.assign("/login");
  }
  return (
    <nav className={classes.nav}>
      <Link className={classes.links} to="/">
        Home
      </Link>
      {logged ? (
        <>
          <Link className={classes.links} to="/" onClick={logoutHandler}>
            Logout
          </Link>
          <Link className={classes.links} to="/recent">
            Recent
          </Link>
        </>
      ) : (
        <Link className={classes.links} to="/login">
          Login
        </Link>
      )}
    </nav>
  );
};
export default NavBar;
