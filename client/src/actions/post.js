import axios from "axios";
import { setAlert } from "./alert.js";
import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  REOMVE_COMMENT,
  UPDATE_LIKES,
} from "./types.js";
import { LIKE_URL, UNLIKE_URL, POST_URL, COMMENT_URL } from "../utils/api.js";
// get posts

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(POST_URL);
    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// add like

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`${LIKE_URL}/${postId}`);
    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// remove like

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`${UNLIKE_URL}/${postId}`);
    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// delete post

export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`${POST_URL}/${postId}`);
    dispatch({ type: DELETE_POST, payload: { id: postId } });
    dispatch(setAlert("Post Removed", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// add post

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  try {
    const res = await axios.post(POST_URL, formData, config);
    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert("Post Added", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// get post

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${POST_URL}/${id}`);
    dispatch({ type: GET_POST, payload: res.data });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// add comment

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    "Content-Type": "application/json",
  };
  try {
    const res = await axios.post(`${COMMENT_URL}/${postId}`, formData, config);
    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert("Comment Added", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// delete comment

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`${COMMENT_URL}/${postId}/${commentId}`);
    dispatch({ type: REOMVE_COMMENT, payload: commentId });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
