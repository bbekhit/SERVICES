import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Private = (Component, type) => {
  class PrivateClass extends React.Component {
    render() {
      // const { auth, dispatch, ...rest } = this.props;
      const { auth } = this.props;
      return !auth.isAuth ? (
        type === "auth" ? (
          <Redirect to="/login" />
        ) : (
          <Component {...this.props} />
        )
      ) : type === "guest" ? (
        <Redirect to="/" />
      ) : (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = state => ({
    auth: state.auth,
  });
  // return connect(({ auth }) => ({ auth }))(Private);
  return connect(mapStateToProps)(PrivateClass);
};

export default Private;
