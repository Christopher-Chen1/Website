import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DDSNotificationProvider } from "@dds/react";

// React (Required)
import "@dds/react/css/dds-components.css";

// Foundations (Highly recommended)
import "@dds/react/css/dds-reboot.css";
import "@dds/react/css/dds-fonts.css";
import "@dds/react/css/dds-icons.css";

// Foundations (Optional)
import "@dds/react/css/dds-main.css";
import "@dds/react/css/dds-helpers.css";
import "@dds/react/css/dds-templates.css";

import "./index.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DDSNotificationProvider>
    <BrowserRouter>
      <App />
      </BrowserRouter>
    </DDSNotificationProvider>
  </React.StrictMode>
);
