/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { useState } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router-dom";
import { login } from "../store/actions/authActions";

const Login = ({ login, auth, history }) => {
  const [redirect, setRedirect] = useState(false);
  const { register, handleSubmit } = useForm();
  const { addToast } = useToasts();

  const onLogin = async loginData => {
    login(loginData).then(history.push("/"), errorMessage =>
      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      })
    );
  };

  // if (redirect) {
  //   return <Redirect to="/kk" />;
  // }

  if (auth.isAuth) {
    return <Redirect to="/" />;
  }
  return (
    <div className="auth-page">
      <div className="container has-text-centered">
        <div className="column is-4 is-offset-4">
          <h3 className="title has-text-grey">Login</h3>
          <p className="subtitle has-text-grey">Please login to proceed.</p>
          <div className="box">
            <figure className="avatar">
              <img src="https://placehold.it/128x128" alt="Company Logo" />
            </figure>
            <form onSubmit={handleSubmit(onLogin)}>
              <div className="field">
                <div className="control">
                  <input
                    ref={register}
                    name="email"
                    className="input is-large"
                    type="email"
                    placeholder="Your Email"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    ref={register}
                    name="password"
                    className="input is-large"
                    type="password"
                    placeholder="Your Password"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="button is-block is-info is-large is-fullwidth"
              >
                Sign In
              </button>
            </form>
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

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(Login);
