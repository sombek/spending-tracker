import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "app/app";

import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
