import "./App.css";
import Login from "./Views/Login";
import NavBar from "./Views/NavBar";
import Recent from "./Views/Recent";
import Game from "./Game/Game";
import NotFound from "./Views/NotFound";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Game} />
          <Route path="/login" component={Login} />
          <Route path="/recent" component={Recent} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
