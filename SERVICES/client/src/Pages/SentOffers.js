import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchSentOffers } from "../store/actions/offerActions";
import { collaborate } from "../store/actions/collaborationActions";
import Private from "../components/Hoc/Private";
import ServiceItem from "../components/service/ServiceItem";
import Spinner from "../components/spinner/Spinner";
import { newMessage, newCollaboration } from "../helpers/offers";
import { useToasts } from "react-toast-notifications";

const ReceivedOffers = ({
  fetchSentOffers,
  collaborate,
  auth: { user },
  offer: { offersSent, loading },
}) => {
  useEffect(() => {
    fetchSentOffers(user.uid);
  }, [fetchSentOffers, user.uid]);
  const { addToast } = useToasts();
  const renderOffers = () =>
    offersSent.map(offer => (
      <div key={offer.id} className="column is-one-third">
        <ServiceItem noButton className="offer-card" service={offer.service}>
          <div className="tag is-large" style={{ marginTop: "15px" }}>
            {offer.status}
          </div>
          <hr />
          <div className="service-offer">
            <div>
              <span className="label">To User:</span> {offer.toUser.fullName}
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
            {offer.status === "accepted" && !offer.collaborationCreated && (
              <div>
                <hr />
                <button
                  onClick={() => createCollaboration(offer)}
                  className="button is-success"
                >
                  Collaborate
                </button>
              </div>
            )}
          </div>
        </ServiceItem>
      </div>
    ));

  const createCollaboration = async offer => {
    const collaboration = newCollaboration({ offer, fromUser: user });
    const message = newMessage({ offer, fromUser: user });
    let result = await collaborate({
      collaboration,
      message,
      messages: user.messages,
    });
    if (result === "success") {
      addToast("Collaboration was Created!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast(result, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="container">
      <div className="content-wrapper">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1 className="title">Sent Offers</h1>
        </div>
        <div className="columns is-multiline">
          {offersSent.length === 0 && loading ? (
            <Spinner />
          ) : offersSent.length !== 0 ? (
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
              <h1>No Sent offers yet</h1>
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

export default connect(mapstatetoProps, { fetchSentOffers, collaborate })(
  Private(ReceivedOffers, "auth")
);
