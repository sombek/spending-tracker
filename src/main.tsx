import App from "app/app";
import "./index.css";

import { createRoot } from "react-dom/client";
import { registerAllModules } from "handsontable/registry";
import { ContextMenu, registerPlugin } from "handsontable/plugins";

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
registerPlugin(ContextMenu);
registerAllModules();
