import { combineReducers } from "@reduxjs/toolkit";
import alert from "./alert.js";
import auth from "./auth.js";
export default combineReducers({
  auth,
  // profile reducer
  // post reducer
  alert,
});
