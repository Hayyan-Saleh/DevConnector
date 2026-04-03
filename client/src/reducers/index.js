import { combineReducers } from "@reduxjs/toolkit";
import alert from "./alert.js";
import auth from "./auth.js";
import profile from "./profile.js";
import post from "./post.js";
export default combineReducers({
  auth,
  profile,
  post,
  alert,
});
