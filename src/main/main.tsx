import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ui/styles/index.css";
import App from "../ui/app/index";
import startGame from "./startGame";
import initializeGlobals from "./globals";

initializeGlobals();
startGame();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
