import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login.js";
import ALert from "./components/layout/alert.js";
import Register from "./components/auth/Register.js";
import "./App.css";
import { loadUser } from "./actions/auth.js";

// Redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route
              exact
              path="/login"
              element={
                <section className="container">
                  <Login />
                  <ALert />
                </section>
              }
            />
            <Route
              exact
              path="/register"
              element={
                <section className="container">
                  <Register />
                  <ALert />
                </section>
              }
            />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
