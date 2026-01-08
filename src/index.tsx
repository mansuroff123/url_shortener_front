import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import "./index.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import LinkStats from "./pages/LinkStats";

const root = document.getElementById("root");

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/stats/:code" component={LinkStats} />
    </Router>
  ),
  root!
);