import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./store";
import LoaderComp from "./components/Common/LoaderComp/LoaderComp";
import ToastComp from "./components/Common/ToastComp/ToastComp";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <LoaderComp />
      <ToastComp />
    </BrowserRouter>
  </Provider>
);

serviceWorker.unregister();