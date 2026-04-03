import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// components
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login.js";
import ALert from "./components/layout/alert.js";
import Register from "./components/auth/Register.js";
import Dashboard from "./components/dashboard/Dashboard.js";
import CreateProfile from "./components/profile-forms/CreateProfile.js";
import EditProfile from "./components/profile-forms/EditProfile.js";
import AddExperience from "./components/profile-forms/AddExperience.js";
import AddEducation from "./components/profile-forms/AddEducation.js";
import Profiles from "./components/profiles/Profiles.js";
import Profile from "./components/profile/Profile.js";
import Posts from "./components/posts/Posts.js";
import Post from "./components/post/Post.js";
import PrivateRoute from "./components/routing/PrivateRoute.js";
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
              path="/profiles"
              element={
                <section className="container">
                  <Profiles />
                  <ALert />
                </section>
              }
            />
            <Route
              exact
              path="/profile/:id"
              element={
                <section className="container">
                  <Profile />
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
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/dashboard"
                element={
                  <section className="container">
                    <Dashboard />
                    <ALert />
                  </section>
                }
              />
            </Route>{" "}
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/create-profile"
                element={
                  <section className="container">
                    <CreateProfile />
                    <ALert />
                  </section>
                }
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/edit-profile"
                element={
                  <section className="container">
                    <EditProfile />
                    <ALert />
                  </section>
                }
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/add-experience"
                element={
                  <section className="container">
                    <AddExperience />
                    <ALert />
                  </section>
                }
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/add-education"
                element={
                  <section className="container">
                    <AddEducation />
                    <ALert />
                  </section>
                }
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/posts"
                element={
                  <section className="container">
                    <Posts />
                    <ALert />
                  </section>
                }
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                exact
                path="/posts/:postId"
                element={
                  <section className="container">
                    <Post />
                    <ALert />
                  </section>
                }
              />
            </Route>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
