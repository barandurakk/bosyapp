import {
  SET_BOSLAR,
  LIKE_BOS,
  UNLIKE_BOS,
  LOADING_DATA,
  DELETE_BOS,
  BOS_YAP,
  SET_BOS,
  SUBMIT_COMMENT,
  DELETE_COMMENT,
  SET_USERLIST,
  UPDATE_BOS,
  SEARCH_TAG,
  SEARCH_USER
} from "../types";

const initialState = {
  boslar: [],
  users: [],
  bos: {},
  loading: false,
  resultTag: [],
  resultUser: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_BOSLAR:
      return {
        ...state,
        boslar: action.payload,
        loading: false
      };
    case SET_BOS:
      return {
        ...state,
        bos: action.payload
      };
    case UPDATE_BOS:
      return {};
    case SET_USERLIST:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case LIKE_BOS:
    case UNLIKE_BOS:
      let index = state.boslar.findIndex(bos => bos.bosId === action.payload.bosId);
      state.boslar[index] = action.payload;
      if (state.bos.bosId === action.payload.bosId) {
        state.bos = action.payload;
      }
      return {
        ...state
      };
    case DELETE_BOS:
      let indexD = state.boslar.findIndex(bos => bos.bosId === action.payload);
      state.boslar.splice(indexD, 1);
      return {
        ...state
      };
    case BOS_YAP:
      state.boslar.unshift(action.payload);
      return {
        ...state
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        bos: {
          ...state.bos,
          comments: [action.payload, ...state.bos.comments]
        }
      };
    case DELETE_COMMENT:
      let indexC = state.bos.comments.findIndex(comment => comment.commentId === action.payload);
      state.bos.comments.splice(indexC, 1);
      return {
        ...state
      };
    case SEARCH_TAG:
      let resultTag = [];
      state.boslar.forEach(bos => {
        if (bos.body.includes(`#${action.payload}`)) {
          resultTag.push(bos);
        }
      });
      return {
        ...state,
        resultTag
      };
    case SEARCH_USER:
      let resultUser = [];
      state.users.forEach(user => {
        if (user.handle.includes(action.payload)) {
          resultUser.push(user);
        }
      });

      return {
        ...state,
        resultUser
      };

    default:
      return state;
  }
};
