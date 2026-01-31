import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ui/styles/index.css";
import App from "../ui/app/index.tsx";
import startGame from "./startGame.ts";
import initializeGlobals from "./globals.ts";

initializeGlobals();
startGame();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
