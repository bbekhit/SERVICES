import { combineReducers } from "redux";
import serviceReducer from "./serviceReducer";
import authReducer from "./authReducer";
import offerReducer from "./offerReducer";
import collaborationReducer from "./collaborationReducer";

const serviceApp = combineReducers({
  service: serviceReducer,
  auth: authReducer,
  offer: offerReducer,
  collaboration: collaborationReducer,
});

export default serviceApp;
