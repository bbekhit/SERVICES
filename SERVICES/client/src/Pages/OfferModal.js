import React, { useState } from "react";
import { connect } from "react-redux";
import db from "../db/index";
import Modal from "../components/Modal";
import { createOffer } from "../store/actions/offerActions";
import { useToasts } from "react-toast-notifications";

const OfferModal = ({ service, auth, createOffer }) => {
  const { addToast } = useToasts();
  const [offer, setOffer] = useState({
    fromUser: "",
    toUser: "",
    service: "",
    status: "pending",
    price: 0,
    time: 0,
    note: "",
  });

  const handleChange = ({ target: { value, name } }) => {
    if (name === "time") {
      const price = Math.round(value * service.price * 100) / 100;
      return setOffer({ ...offer, [name]: value, price });
    }

    return setOffer({ ...offer, [name]: value });
  };

  const handleSubmit = async closeModal => {
    const offerCopy = { ...offer };
    const createRef = (collection, docId) => db.doc(`${collection}/` + docId);
    offerCopy.fromUser = createRef("profiles", auth.user.uid);
    offerCopy.toUser = createRef("profiles", service.user.id);
    offerCopy.service = createRef("services", service.id);
    offerCopy.time = parseInt(offer.time, 10);

    let result = await createOffer(offerCopy);
    if (result === "success") {
      closeModal();
      addToast("Offer was succefuly created! (:", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    } else {
      addToast(result, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
  };

  const isOwnService = auth.user ? auth.user.uid === service.user.uid : true;

  return (
    <div>
      {!isOwnService ? (
        <Modal onModalSubmit={handleSubmit} openButtonText="Make an offer">
          <div className="field">
            <input
              onChange={handleChange}
              name="note"
              className="input is-large"
              type="text"
              placeholder="Write some catchy note"
              max="5"
              min="0"
            />
            <p className="help">
              Note can increase chance of getting the service
            </p>
          </div>
          <div className="field">
            <input
              onChange={handleChange}
              name="time"
              className="input is-large"
              type="number"
              placeholder="How long you need service for ?"
              max="5"
              min="0"
            />
            <p className="help">Enter time in hours</p>
          </div>
          <div className="service-price has-text-centered">
            <div className="service-price-title">
              {service.user &&
                `Uppon acceptance ${service.user.fullName}" will charge you:`}
            </div>
            <div className="service-price-value">
              <h1 className="title">{offer.price}$</h1>
            </div>
          </div>
        </Modal>
      ) : (
        <h1 style={{ color: "red" }}>Can't make an offer on you own service</h1>
      )}
    </div>
  );
};

export default connect(null, { createOffer })(OfferModal);
