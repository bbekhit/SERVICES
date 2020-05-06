import {
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICE_SUCCESS,
  REQUEST_SERVICE,
  FETCH_USER_SERVICES_SUCCESS,
} from "../actions/types";

const initialState = {
  services: [],
  service: {},
  // isFetching: false,
  isFetching: true,
  userServices: [],
};

const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICES_SUCCESS:
      return {
        ...state,
        services: action.payload,
        isFetching: false,
      };
    case FETCH_SERVICE_SUCCESS:
      return {
        ...state,
        service: action.payload,
        isFetching: false,
      };
    case FETCH_USER_SERVICES_SUCCESS:
      return {
        ...state,
        userServices: action.payload,
        isFetching: false,
      };
    case REQUEST_SERVICE:
      return {
        ...state,
        isFetching: true,
      };
    default:
      return state;
  }
};

export default serviceReducer;
