import React from "react";
import { connect } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Routes from "./Routes";
import Spinner from "./components/spinner/Spinner";

import { logout } from "./store/actions/authActions";

class ServiceApp extends React.Component {
  handleLogout = uid => this.props.logout(uid);

  renderApplication = auth => (
    <React.Fragment>
      <Navbar
        logout={() => this.handleLogout(auth.user.uid)}
        auth={auth}
        id="navbar-main"
      />
      <Navbar
        auth={auth}
        logout={() => this.handleLogout(auth.user.uid)}
        id="navbar-clone"
      />
      <Sidebar />
      <Routes />
    </React.Fragment>
  );

  render() {
    const { auth } = this.props;
    return auth.isAuthResolved ? this.renderApplication(auth) : <Spinner />;
  }
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps, { logout })(ServiceApp);
