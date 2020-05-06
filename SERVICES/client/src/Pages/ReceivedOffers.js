import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  fetchReceivedOffers,
  changeOfferStatus,
} from "../store/actions/offerActions";
import Private from "../components/Hoc/Private";
import ServiceItem from "../components/service/ServiceItem";
import Spinner from "../components/spinner/Spinner";

const ReceivedOffers = ({
  fetchReceivedOffers,
  changeOfferStatus,
  auth: { user },
  offer: { offersReceived, loading },
}) => {
  useEffect(() => {
    fetchReceivedOffers(user.uid);
  }, [fetchReceivedOffers, user.uid]);

  const renderOffers = () =>
    offersReceived.map(offer => (
      <div key={offer.id} className="column is-one-third">
        <ServiceItem noButton className="offer-card" service={offer.service}>
          <div
            className={`tag is-large ${statusClass(offer.status)}`}
            style={{ marginTop: "15px" }}
          >
            {offer.status}
          </div>
          <hr />
          <div className="service-offer">
            <div>
              <span className="label">From User:</span>{" "}
              {offer.fromUser.fullName}
            </div>
            <div>
              <span className="label">Note:</span> {offer.note}
            </div>
            <div>
              <span className="label">Price:</span> ${offer.price}
            </div>
            <div>
              <span className="label">Time:</span> {offer.time} hours
            </div>
          </div>
          {offer.status === "pending" && (
            <div>
              <hr />
              <button
                onClick={() => acceptOffer(offer.id)}
                className="button is-success s-m-r"
              >
                Accept
              </button>
              <button
                onClick={() => declineOffer(offer.id)}
                className="button is-danger"
              >
                Decline
              </button>
            </div>
          )}
        </ServiceItem>
      </div>
    ));

  const acceptOffer = offerId => {
    changeOfferStatus(offerId, "accepted");
  };

  const declineOffer = offerId => {
    changeOfferStatus(offerId, "declined");
  };

  const statusClass = status => {
    if (status === "pending") return "is-warning";
    if (status === "accepted") return "is-success";
    if (status === "declined") return "is-danger";
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1 className="title">Received Offers</h1>
        </div>
        <div className="columns is-multiline">
          {offersReceived.length === 0 && loading ? (
            <Spinner />
          ) : offersReceived.length !== 0 ? (
            renderOffers()
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "2rem",
                display: "flex",
                justifyContent: "center",
                border: "1px solid lightgrey",
                width: "90vw",
                margin: "100px auto",
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ width: "100%" }}>No Received offers yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapstatetoProps = state => ({
  offer: state.offer,
});

export default connect(mapstatetoProps, {
  fetchReceivedOffers,
  changeOfferStatus,
})(Private(ReceivedOffers, "auth"));
