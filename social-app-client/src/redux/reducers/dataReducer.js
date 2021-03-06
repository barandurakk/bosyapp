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
  SEARCH_USER,
  LOAD_MORE_BOS,
} from "../types";

const initialState = {
  boslar: [],
  userBoslar: [],
  users: [],
  bos: {},
  loading: false,
  resultTag: [],
  resultUser: [],
  lastVisible: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_BOSLAR:
      return {
        ...state,
        userBoslar: action.payload,
        loading: false,
      };

    case LOAD_MORE_BOS:
      const lastVisible = action.payload[action.payload.length - 1].createdAt;
      const newBos = action.payload.slice(0, action.payload.length - 1);
      const newBoslar = state.boslar.concat(newBos);

      return {
        ...state,
        boslar: newBoslar,
        loading: false,
        lastVisible,
      };

    case SET_BOS:
      return {
        ...state,
        bos: action.payload,
      };
    case UPDATE_BOS:
      return {};
    case SET_USERLIST:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case LIKE_BOS:
    case UNLIKE_BOS:
      let index = state.boslar.findIndex((bos) => bos.bosId === action.payload.bosId);
      state.boslar[index] = action.payload;
      if (state.bos.bosId === action.payload.bosId) {
        state.bos = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_BOS:
      let indexD = state.boslar.findIndex((bos) => bos.bosId === action.payload);
      state.boslar.splice(indexD, 1);
      return {
        ...state,
      };
    case BOS_YAP:
      state.boslar.unshift(action.payload);
      return {
        ...state,
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        bos: {
          ...state.bos,
          comments: [action.payload, ...state.bos.comments],
        },
      };
    case DELETE_COMMENT:
      let indexC = state.bos.comments.findIndex((comment) => comment.commentId === action.payload);
      state.bos.comments.splice(indexC, 1);
      return {
        ...state,
      };
    case SEARCH_TAG:
      let keywordTag = action.payload.keyword.toLowerCase();
      let boslar = action.payload.boslar;
      let searchResultTag = [];

      boslar.map((bos) => {
        let bosBody = bos.body.toLowerCase();
        if (bosBody.includes(`#${keywordTag}`)) {
          searchResultTag.push(bos);
        }
      });

      return {
        ...state,
        resultTag: searchResultTag,
        loading: false,
      };

    case SEARCH_USER:
      let keywordUser = action.payload.keyword.toLowerCase();
      let users = action.payload.users;
      let searchResultUser = [];

      users.map((user) => {
        let userHandle = user.handle.toLowerCase();
        let userNick = user.nickname.toLowerCase();
        if (userHandle.includes(keywordUser) || userNick.includes(keywordUser)) {
          searchResultUser.push(user);
        }
      });

      return {
        ...state,
        resultUser: searchResultUser,
        loading: false,
      };
    default:
      return state;
  }
};
