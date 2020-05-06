import db from "../db/index";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const createRef = (collection, docId) => db.doc(`${collection}/` + docId);
// --------- Services ----------
export const fetchServiceById = serviceId =>
  db
    .collection("services")
    .doc(serviceId)
    .get()
    .then(snapshot => ({ id: snapshot.id, ...snapshot.data() }));

export const fetchServices = () =>
  db
    .collection("services")
    .get()
    .then(snapshot => {
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return services;
    });

// --------- AUTH ----------

const createUserProfile = userProfile =>
  db.collection("profiles").doc(userProfile.uid).set(userProfile);

export const register = async ({ email, password, fullName, avatar }) => {
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
      description: "",
    };
    await createUserProfile(userProfile);
    return userProfile;
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export const login = ({ email, password }) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(error => Promise.reject(error.message));

export const onAuthStateChanged = onAuthCallback =>
  firebase.auth().onAuthStateChanged(onAuthCallback);

export const getUserProfile = uid =>
  db
    .collection("profiles")
    .doc(uid)
    .get()
    .then(snapshot => ({ uid, ...snapshot.data() }));

export const logout = () => firebase.auth().signOut();

// --------- connection ----------
// realtime database reference
export const createFirebaseRef = (collection, id) =>
  firebase.database().ref(`/${collection}/${id}`);

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const isOnlineForDatabase = {
  state: "online",
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const onConnectionChanged = callback =>
  firebase
    .database()
    .ref(".info/connected")
    .on("value", snapshot => {
      callback(snapshot.val());
    });

// --------- collaboration ----------
export const subToCollaboration = (collabId, done) =>
  db
    .collection("collaborations")
    .doc(collabId)
    .onSnapshot(snapshot => {
      const collab = { id: snapshot.id, ...snapshot.data() };
      done(collab);
    });

export const joinCollaboration = (collabId, uid) => {
  const userRef = createRef("profiles", uid);

  return db
    .collection("collaborations")
    .doc(collabId)
    .update({
      joinedPeople: firebase.firestore.FieldValue.arrayUnion(userRef),
    });
};

export const leaveCollaboration = (collabId, uid) => {
  const userRef = createRef("profiles", uid);

  return db
    .collection("collaborations")
    .doc(collabId)
    .update({
      joinedPeople: firebase.firestore.FieldValue.arrayRemove(userRef),
    });
};

export const subToProfile = (uid, done) =>
  db
    .collection("profiles")
    .doc(uid)
    .onSnapshot(snapshot => {
      const user = { id: snapshot.id, ...snapshot.data() };
      done(user);
    });

export const sendChatMessage = ({ message, collabId, timestamp }) =>
  db
    .collection("collaborations")
    .doc(collabId)
    .collection("messages")
    .doc(timestamp)
    .set(message);

export const subToMessages = (collabId, done) =>
  db
    .collection("collaborations")
    .doc(collabId)
    .collection("messages")
    .onSnapshot(snapshot => done(snapshot.docChanges()));

export const startCollaboration = (collabId, expiresAt) =>
  db.collection("collaborations").doc(collabId).update({ expiresAt });
