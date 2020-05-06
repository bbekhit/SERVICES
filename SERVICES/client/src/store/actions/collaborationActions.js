import db from "../../db/index";
import {
  COLLABORATION_CREATED_FROM_OFFER,
  FETCH_USER_MESSAGES_SUCCESS,
  MARK_MESSAGE_AS_READ,
  SET_COLLABORATION,
  SET_COLLABORATION_JOINED_PEOPLE,
  UPDATE_COLLABORATION_USER,
  SET_COLLABORATION_MESSAGES,
  RESET_COLLABORATION_MESSAGES,
} from "./types";
import * as api from "../../api";

export const collaborate = ({
  collaboration,
  message,
  messages,
}) => async dispatch => {
  try {
    let collabId = await db
      .collection("collaborations")
      .add(collaboration)
      .then(docRef => docRef.id);

    message.cta = `/collaborations/${collabId}`;

    await db
      .collection("profiles")
      .doc(message.toUser)
      .collection("messages")
      .add(message);

    await db
      .collection("offers")
      .doc(collaboration.fromOffer)
      .update({ collaborationCreated: true });
    await dispatch({ type: FETCH_USER_MESSAGES_SUCCESS, payload: messages });
    dispatch({
      type: COLLABORATION_CREATED_FROM_OFFER,
      offerId: collaboration.fromOffer,
    });
    return "success";
  } catch (error) {
    return "Something went wrong";
  }
};

export const subscribeToMessages = (userId, callback) => dispatch => {
  db.collection("profiles")
    .doc(userId)
    .collection("messages")
    .onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: FETCH_USER_MESSAGES_SUCCESS, payload: messages });
    });
};

export const markMessageAsRead = message => dispatch => {
  db.collection("profiles")
    .doc(message.toUser)
    .collection("messages")
    .doc(message.id)
    .update({ isRead: true });
  dispatch({ type: MARK_MESSAGE_AS_READ, messageId: message.id });
};

export const fetchCollaborations = userId => () => {
  let result = db
    .collection("collaborations")
    .where("allowedPeople", "array-contains", userId)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );
  return result;
};

export const subToCollaboration = (collabId, done) => dispatch =>
  api.subToCollaboration(collabId, async collaboration => {
    let joinedPeople = [];

    if (collaboration.joinedPeople) {
      joinedPeople = await Promise.all(
        collaboration.joinedPeople.map(async userRef => {
          const userSnapshot = await userRef.get();
          return { id: userSnapshot.id, ...userSnapshot.data() };
        })
      );
    }

    dispatch({ type: SET_COLLABORATION, collaboration });
    dispatch({ type: SET_COLLABORATION_JOINED_PEOPLE, joinedPeople });
    done({ joinedPeople });
  });

export const joinCollaboration = (collabId, userId) =>
  api.joinCollaboration(collabId, userId);

export const leaveCollaboration = (collabId, userId) =>
  api.leaveCollaboration(collabId, userId);

export const subToProfile = uid => dispatch =>
  api.subToProfile(uid, user =>
    dispatch({ type: UPDATE_COLLABORATION_USER, user })
  );

export const sendChatMessage = message => api.sendChatMessage(message);

export const subToMessages = collabId => dispatch => {
  dispatch({ type: RESET_COLLABORATION_MESSAGES });
  return api.subToMessages(collabId, messages => {
    dispatch({ type: SET_COLLABORATION_MESSAGES, messages });
  });
};

export const startCollaboration = (collabId, expiresAt) =>
  api.startCollaboration(collabId, expiresAt);
