import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/Home";
import Menu from "./core/Menu";
import { NotificationContainer } from "react-notifications";
import ProductsByCategory from "./core/ProductsByCategory";
import Footer from "./core/Footer";
import SuccessfulPayment from "./core/SuccessfulPayment";
import Cart from "./core/Cart";
import FailedPayment from "./core/FailedPayment";

const Routes = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route
          exact
          path="/product/:categoryId"
          component={ProductsByCategory}
        />
        <Route exact path="/checkout/success" component={SuccessfulPayment} />
        <Route exact path="/checkout/failed" component={FailedPayment} />
        <Route exact path="/cart" component={Cart} />
        <Redirect from="/" to="/home" />
      </Switch>
      <Footer />
      <NotificationContainer />
    </BrowserRouter>
  );
};

export default Routes;
