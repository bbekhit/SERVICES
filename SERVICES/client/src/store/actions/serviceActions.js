import {
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICE_SUCCESS,
  FETCH_USER_SERVICES_SUCCESS,
} from "./types";
import db from "../../db/index";

export const createRef = (collection, docId) =>
  db.doc(`${collection}/` + docId);

export const fetchServices = () => async dispatch => {
  try {
    let services = await db
      .collection("services")
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    dispatch({
      type: FETCH_SERVICES_SUCCESS,
      payload: services,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SERVICES_SUCCESS,
      payload: [],
    });
  }
};

export const fetchServiceById = serviceId => async dispatch => {
  try {
    let service = await db
      .collection("services")
      .doc(serviceId)
      .get()
      .then(snapshot => ({ id: snapshot.id, ...snapshot.data() }));
    const user = await service.user.get();
    service.user = user.data();
    service.user.id = user.id;
    dispatch({
      type: FETCH_SERVICE_SUCCESS,
      payload: service,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SERVICE_SUCCESS,
      payload: {},
    });
  }
};

export const createService = (newService, userId) => async dispatch => {
  newService.price = parseInt(newService.price, 10);
  newService.user = createRef("profiles", userId);
  try {
    db.collection("services")
      .add(newService)
      .then(docRef => docRef.id);
    return "success";
  } catch (error) {
    return error.message;
  }
};

export const fetchUserServices = userId => async dispatch => {
  const userRef = createRef("profiles", userId);
  try {
    let res = await db
      .collection("services")
      .where("user", "==", userRef)
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    dispatch({
      type: FETCH_USER_SERVICES_SUCCESS,
      payload: res,
    });
  } catch (error) {
    console.log(error);
  }
};
