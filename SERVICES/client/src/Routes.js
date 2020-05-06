import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import FaqPage from "./Pages/Faq";
import ServicesPage from "./Pages/Services";
import ProfilePage from "./Pages/Profile";
import HomePage from "./Pages/Home";
import ServiceDetailPage from "./Pages/ServiceDetail";
import PrivateRoute from "./components/Hoc/PrivateRoute";
import ServiceCreate from "./Pages/ServiceCreate";
import UserServices from "./Pages/UserServices";
import SentOffersPage from "./Pages/SentOffers";
import ReceivedOffersPage from "./Pages/ReceivedOffers";
import ReceivedCollaborationsPage from "./Pages/ReceivedCollaborations";
import CollaborationDetailPage from "./Pages/CollaborationDetail";
import Logout from "./Pages/Logout";

const Routes = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/register" component={RegisterPage} />
    <PrivateRoute exact path="/services/new" component={ServiceCreate} />
    <PrivateRoute exact path="/services/me" component={UserServices} />
    <Route exact path="/services/:serviceId" component={ServiceDetailPage} />
    <Route exact path="/services" component={ServicesPage} />
    <Route exact path="/" component={HomePage} />
    <Route exact path="/profile" component={ProfilePage} />
    <PrivateRoute exact path="/faq" component={FaqPage} />
    <Route exact path="/register" component={RegisterPage} />
    <Route exact path="/offers/sent" component={SentOffersPage} />
    <Route exact path="/offers/received" component={ReceivedOffersPage} />
    <Route exact path="/logout" component={Logout} />
    <PrivateRoute
      exact
      path="/collaborations/me"
      component={ReceivedCollaborationsPage}
    />
    <PrivateRoute
      exact
      path="/collaborations/:id"
      component={CollaborationDetailPage}
    />
  </Switch>
);

export default Routes;
