import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Admin, Debug } from "./views"
import "antd/dist/antd.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/debug">
            <Debug />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/projects">
          </Route>
          <Route path="/">
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
