import {
  FETCH_OFFERS_RECEIVED_SUCCESS,
  FETCH_OFFERS_SENT_SUCCESS,
  RESET_LOADING,
  CHANGE_OFFER_STATUS,
  COLLABORATION_CREATED_FROM_OFFER,
} from "../actions/types";

const initialState = {
  offersReceived: [],
  offersSent: [],
  loading: true,
};
const offerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OFFERS_RECEIVED_SUCCESS:
      return {
        ...state,
        offersReceived: action.payload,
        loading: false,
      };
    case FETCH_OFFERS_SENT_SUCCESS:
      return {
        ...state,
        offersSent: action.payload,
        loading: false,
      };
    case RESET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_OFFER_STATUS:
      const nextState = [...state.offersReceived];
      const offerIndex = nextState.findIndex(o => o.id === action.offerId);
      nextState[offerIndex].status = action.status;
      return {
        ...state,
        offersReceived: nextState,
      };
    case COLLABORATION_CREATED_FROM_OFFER: {
      const nextState = [...state.offersSent];
      const offerIndex = nextState.findIndex(o => o.id === action.offerId);
      nextState[offerIndex].collaborationCreated = true;
      return {
        ...state,
        offersSent: nextState,
      };
    }
    default:
      return state;
  }
};

export default offerReducer;
