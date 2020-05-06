import {
  SET_AUTH_USER,
  RESET_AUTH_STATE,
  RESOLVE_AUTH_STATE,
  FETCH_USER_MESSAGES_SUCCESS,
  MARK_MESSAGE_AS_READ,
} from "../actions/types";

const initialState = {
  // user: null,
  user: {},
  isAuth: false,
  isAuthResolved: false,
  // messages: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.user,
        // isAuth: !!action.user,
        isAuth: Object.keys(action.user).length > 0,
        isAuthResolved: true,
        // messages: [],
      };
    case RESET_AUTH_STATE:
      return { ...state, isAuthResolved: false };
    case RESOLVE_AUTH_STATE:
      return { ...state, isAuthResolved: true };
    // case LOGOUT_USER:
    //   return {
    //     ...state,
    //     user: action.user,
    //     messages: [],
    //     isAuth: !!action.user,
    //     isAuthResolved: true,
    //   };
    case FETCH_USER_MESSAGES_SUCCESS:
      return { ...state, user: { ...state.user, messages: action.payload } };
    case MARK_MESSAGE_AS_READ:
      const newMessages = state.user.messages.map(message => {
        if (message.id === action.messageId) {
          message.isRead = true;
        }
        return message;
      });
      return { ...state, messages: newMessages };
    default:
      return state;
  }
};

export default authReducer;
