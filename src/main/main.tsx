import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../ui/app/index";
import initializeGlobals from "./globals";
import startGame from "./startGame";
import "@ui/styles/index.css";

initializeGlobals();
startGame();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
