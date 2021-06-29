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
import AppStateProvider from "./context/AppStateProvider";
import AdminRoute from "./auth/AdminRoute";
import Dashboard from "./admin/Dashboard";
import ForgotPassword from "./core/ForgotPassword";
import ResetPassword from "./core/ResetPassword";
import CategoryDetails from "./admin/CategoryDetails";
import ProductDetails from "./admin/ProductDetails";
import ManageProducts from "./admin/ManageProducts";
import ShopRegistration from "./user/ShopRegistration";

const Routes = () => {
  return (
    <AppStateProvider>
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
          <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
          <AdminRoute
            exact
            path="/admin/create/category"
            component={CategoryDetails}
          />
          <AdminRoute
            exact
            path="/admin/create/product"
            component={ProductDetails}
          />
          <AdminRoute
            path="/update/product/:productId"
            component={ProductDetails}
          />
          <AdminRoute
            exact
            path="/admin/manage/products"
            component={ManageProducts}
          />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/shop/register" component={ShopRegistration} />
          <Route path="/auth/password/reset/:token" component={ResetPassword} />
          <Redirect from="/" to="/home" />
        </Switch>
        <Footer />
        <NotificationContainer />
      </BrowserRouter>
    </AppStateProvider>
  );
};

export default Routes;
