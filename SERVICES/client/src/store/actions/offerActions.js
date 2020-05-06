import db from "../../db/index";
import {
  FETCH_OFFERS_RECEIVED_SUCCESS,
  FETCH_OFFERS_SENT_SUCCESS,
  RESET_LOADING,
  CHANGE_OFFER_STATUS,
} from "./types";

const createRef = (collection, docId) => db.doc(`${collection}/` + docId);

export const createOffer = offer => dispatch => {
  try {
    db.collection("offers").add(offer);
    return "success";
  } catch (error) {
    return "Can't create offer at this time, try again later!";
  }
};

const extractDataFromOffer = async (offer, userType) => {
  const service = await offer.service.get();
  const user = await offer[userType].get();

  offer.service = service.data();
  offer.service.id = service.id;
  offer[userType] = user.data();

  return offer;
};

export const fetchSentOffers = userId => async dispatch => {
  const userRef = createRef("profiles", userId);
  dispatch({ type: RESET_LOADING });
  try {
    let sentOffers = await db
      .collection("offers")
      .where("fromUser", "==", userRef)
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
      .then(
        async offers =>
          await Promise.all(
            offers.map(offer => extractDataFromOffer(offer, "toUser"))
          )
      );
    dispatch({
      type: FETCH_OFFERS_SENT_SUCCESS,
      payload: sentOffers,
    });
    return "success";
  } catch (error) {
    dispatch({
      type: FETCH_OFFERS_SENT_SUCCESS,
      payload: [],
    });
  }
};

export const fetchReceivedOffers = userId => async dispatch => {
  const userRef = createRef("profiles", userId);
  dispatch({ type: RESET_LOADING });
  try {
    let receivedOffers = await db
      .collection("offers")
      .where("toUser", "==", userRef)
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
      .then(
        async offers =>
          await Promise.all(
            offers.map(offer => extractDataFromOffer(offer, "fromUser"))
          )
      );
    dispatch({
      type: FETCH_OFFERS_RECEIVED_SUCCESS,
      payload: receivedOffers,
    });
    return "success";
  } catch (error) {
    dispatch({
      type: FETCH_OFFERS_RECEIVED_SUCCESS,
      payload: [],
    });
  }
};

export const changeOfferStatus = (offerId, status) => async dispatch => {
  await db.collection("offers").doc(offerId).update({ status });
  dispatch({ type: CHANGE_OFFER_STATUS, offerId, status });
};

export const acceptOffer = offerId => async dispatch => {
  await changeOfferStatus(offerId, "accepted");
  dispatch({
    type: CHANGE_OFFER_STATUS,
    status: "accepted",
    offerId,
  });
};

export const declineOffer = offerId => async dispatch => {
  await changeOfferStatus(offerId, "declined");
  dispatch({
    type: CHANGE_OFFER_STATUS,
    status: "declined",
    offerId,
  });
};
