import {
  SET_BOSLAR,
  LOADING_DATA,
  LOADING_UI,
  LIKE_BOS,
  UNLIKE_BOS,
  DELETE_BOS,
  BOS_YAP,
  CLEAR_ERRORS,
  SET_BOS,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SET_ERRORS,
  DELETE_COMMENT,
  SET_USERLIST,
  SEARCH_TAG,
  SEARCH_USER,
  LOAD_MORE_BOS,
} from "../types";
import axios from "axios";

//Get all bos
export const getBos = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });

  axios
    .get("/boslar")
    .then((res) => {
      dispatch({
        type: SET_BOSLAR,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_BOSLAR,
        payload: [],
      });
    });
};

//get batch of bos
export const getBatchBos = (bosFilter) => (dispatch) => {
  dispatch({ type: LOADING_DATA });

  axios
    .post("/limitedboslar", bosFilter)
    .then((res) => {
      dispatch({
        type: LOAD_MORE_BOS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LOAD_MORE_BOS,
        payload: [],
      });
    });
};

//get All users
export const getAllUsers = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });

  axios
    .get("/users")
    .then((res) => {
      dispatch({
        type: SET_USERLIST,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_USERLIST,
        payload: [],
      });
    });
};

//Like bos
export const likeBos = (bosId) => (dispatch) => {
  axios
    .get(`boslar/${bosId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_BOS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Unlike bos
export const unlikeBos = (bosId) => (dispatch) => {
  axios
    .get(`boslar/${bosId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_BOS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//delete bos
export const deleteBos = (bosId) => (dispatch) => {
  axios
    .get(`/boslar/${bosId}/delete`)
    .then((res) => {
      dispatch({
        type: DELETE_BOS,
        payload: bosId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//delete comment
export const deleteComment = (commentId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/comments/${commentId}/delete`)
    .then((res) => {
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

//edit boş
export const editBos = (bosId, bosBody) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/boslar/${bosId}/update`, bosBody)
    .then((res) => {
      dispatch(getBos());
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      console.log(err);
    });
};

//Boş Dialog
export const getABos = (bosId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/boslar/${bosId}`)
    .then((res) => {
      dispatch({
        type: SET_BOS,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const bosyap = (bosData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/bosyap", bosData)
    .then((res) => {
      dispatch({
        type: BOS_YAP,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

//comment
export const submitComment = (bosId, commentData) => (dispatch) => {
  axios
    .post(`/boslar/${bosId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

//search tag
export const searchTag = (keyword) => (dispatch) => {
  dispatch({
    type: SEARCH_TAG,
    payload: keyword,
  });
};

//search user
export const searchUser = (keyword) => (dispatch) => {
  dispatch({
    type: SEARCH_USER,
    payload: keyword,
  });
};

export const getUserPageData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_BOSLAR,
        payload: res.data.boslar,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_BOSLAR,
        payload: null,
      });
    });
};
