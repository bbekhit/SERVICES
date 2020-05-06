import React, { useEffect, useState } from "react";
import Spinner from "../components/spinner/Spinner";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const Logout = ({ auth }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });
  if (loading) {
    return <Spinner />;
  }
  if (!auth.isAuth) {
    return <Redirect to="/" />;
  }
  return <div>You are logged out</div>;
};

export default connect(({ auth }) => ({ auth }))(Logout);
