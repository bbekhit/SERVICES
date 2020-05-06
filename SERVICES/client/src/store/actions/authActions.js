import * as api from "../../api/index";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db/index";
import { SET_AUTH_USER, RESET_AUTH_STATE, RESOLVE_AUTH_STATE } from "./types";

const createUserProfile = userProfile =>
  db.collection("profiles").doc(userProfile.uid).set(userProfile);

export const register = ({
  email,
  password,
  fullName,
  avatar,
}) => async dispatch => {
  try {
    const res = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const { user } = res;
    const userProfile = {
      uid: user.uid,
      fullName,
      email,
      avatar,
      services: [],
      messages: [],
      description: "",
    };

    await createUserProfile(userProfile);
    return "success";
  } catch (error) {
    return error.message;
  }
};

export const login = ({ email, password }) => async dispatch => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const getUserProfile = uid =>
  db
    .collection("profiles")
    .doc(uid)
    .get()
    .then(snapshot => ({ uid, ...snapshot.data() }));

// export const storeAuthUser = authUser => async dispatch => {
//   try {
//     if (authUser) {
//       let userWithProfile = await getUserProfile(authUser.uid);
//       dispatch({ type: SET_AUTH_USER, user: userWithProfile });
//     }
//   } catch (error) {
//     dispatch({ type: SET_AUTH_USER, user: {} });
//   }
// };

export const onAuthStateChanged = onAuthCallback =>
  api.onAuthStateChanged(onAuthCallback);

export const storeAuthUser = authUser => dispatch => {
  dispatch({ type: RESET_AUTH_STATE });
  if (authUser) {
    return api
      .getUserProfile(authUser.uid)
      .then(userWithProfile =>
        dispatch({ user: userWithProfile, type: SET_AUTH_USER })
      );
  } else {
    return dispatch({ user: {}, type: SET_AUTH_USER });
  }
};

export const logout = uid => dispatch =>
  api
    .logout()
    .then(_ => {
      const userStatusDatabaseRef = api.createFirebaseRef("status", uid);
      return userStatusDatabaseRef.set(api.isOfflineForDatabase);
    })
    .then(_ => dispatch({ user: {}, type: SET_AUTH_USER }));
export const resetAuthState = () => ({ type: RESET_AUTH_STATE });
export const resolveAuthState = () => ({ type: RESOLVE_AUTH_STATE });
