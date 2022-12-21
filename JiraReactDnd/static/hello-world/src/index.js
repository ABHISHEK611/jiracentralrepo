import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom";
//import { createRoot } from "react-dom/client";

import App from "./app";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
