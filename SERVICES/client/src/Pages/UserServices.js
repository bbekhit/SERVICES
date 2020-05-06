import React, { useEffect } from "react";
import { connect } from "react-redux";
import Private from "../components/Hoc/Private";
import { fetchUserServices } from "../store/actions/serviceActions";
import ServiceItem from "../components/service/ServiceItem";

const UserServices = ({
  fetchUserServices,
  auth,
  service: { userServices },
}) => {
  useEffect(() => {
    fetchUserServices(auth.user.uid);
    return () => {
      return null;
    };
  }, [fetchUserServices, auth.user.uid]);
  return (
    <div className="container">
      <div className="content-wrapper">
        <h1 className="title">Your Services</h1>
        <div className="columns is-multiline">
          {userServices.map(s => (
            <div key={s.id} className="column">
              <ServiceItem service={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  service: state.service,
});

export default connect(mapStateToProps, { fetchUserServices })(
  Private(UserServices, "auth")
);
