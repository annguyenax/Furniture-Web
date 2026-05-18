import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import store from "./redux/store";
import App from "./App";
import "./index.css";
import "./config/axios";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleReCaptchaProvider
          reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          language="vi"
          useRecaptchaNet={false}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
          }}
        >
          <App />
        </GoogleReCaptchaProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
