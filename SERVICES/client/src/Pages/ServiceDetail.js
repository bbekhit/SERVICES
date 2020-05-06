import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { fetchServiceById } from "../store/actions/serviceActions";
import Spinner from "../components/spinner/Spinner";
import OfferModal from "./OfferModal";

const ServiceDetail = ({
  fetchServiceById,
  service: { service, isFetching },
  auth,
}) => {
  const { serviceId } = useParams();

  useEffect(() => {
    fetchServiceById(serviceId);
  }, [fetchServiceById, serviceId]);

  if (serviceId !== service.id) {
    return <Spinner />;
  }
  if (isFetching || Object.keys(service).length === 0) {
    return <Spinner />;
  }

  return (
    <section className="hero is-fullheight is-default is-bold service-detail-page">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns is-vcentered">
            <div className="column is-5">
              <figure className="image is-4by3">
                <img src={service.image} alt="Description" />
              </figure>
            </div>
            <div className="column is-6 is-offset-1">
              <div className="service-header-container">
                <div className="media service-user">
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img
                        className="is-rounded"
                        src={service.user.avatar}
                        alt={service.user.fullName}
                      />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">{service.user.fullName}</p>
                    <p className="subtitle is-6">Owner</p>
                  </div>
                </div>
                <div className="service-price">
                  <div className="media service-user">
                    <div className="media-content">
                      <p className="title is-4">${service.price}</p>
                      <p className="subtitle is-6">Per Hour</p>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="title service-title is-2">{service.title}</h1>
              <div className="tag is-large service-category">
                {service.category}
              </div>
              <h2 className="subtitle is-4">{service.description}</h2>
              <br />
              <div className="has-text-centered">
                <OfferModal auth={auth} service={service} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = state => ({
  service: state.service,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  fetchServiceById,
})(ServiceDetail);
