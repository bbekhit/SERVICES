/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { connect } from "react-redux";
import { register } from "../store/actions/authActions";
import RegisterForm from "../components/auth/RegisterForm";
import { useToasts } from "react-toast-notifications";
import Private from "../components/Hoc/Private";

const Register = ({ register, history }) => {
  const { addToast } = useToasts();

  const registerUser = async userData => {
    let result = await register(userData);
    if (result === "success") {
      history.push("/");
      addToast("You registered successfully", {
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

  return (
    <div className="auth-page">
      <div className="container has-text-centered">
        <div className="column is-4 is-offset-4">
          <h3 className="title has-text-grey">Register</h3>
          <p className="subtitle has-text-grey">Please Register to proceed.</p>
          <div className="box">
            <figure className="avatar">
              <img src="https://placehold.it/128x128" alt="Company Logo" />
            </figure>
            <RegisterForm onRegister={registerUser} />
          </div>
          <p className="has-text-grey">
            <a>Sign In With Google</a>&nbsp;
            <a href="/">Sign Up</a> &nbsp;·&nbsp;
            <a href="../">Need Help?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { register })(Private(Register, "guest"));
