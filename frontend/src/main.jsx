import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { VoiceLanguageProvider } from "./components/VoiceLanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <VoiceLanguageProvider>
        <App />
      </VoiceLanguageProvider>
    </BrowserRouter>
  </StrictMode>
);