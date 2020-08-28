import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_BOS,
  UNLIKE_BOS,
  MARK_NOTIFICATION
} from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: [],
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        credentials: {
          ...action.payload.credentials
        },
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        ...state.credentials,
        loading: true
      };
    case LIKE_BOS:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            bosId: action.payload.bosId
          }
        ]
      };
    case UNLIKE_BOS:
      return {
        ...state,
        likes: state.likes.filter(like => like.bosId !== action.payload.bosId)
      };
    case MARK_NOTIFICATION:
      state.notifications.forEach(notif => (notif.read = true));
      return {
        ...state
      };
    default:
      return state;
  }
};
