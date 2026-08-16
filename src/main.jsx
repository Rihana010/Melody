import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { PlayerProvider } from "./context/PlayerContext.jsx";
import { LibraryProvider } from "./context/LibraryContext.jsx";
import { PlaylistProvider } from "./context/PlaylistContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LibraryProvider>
      <PlaylistProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </PlaylistProvider>
    </LibraryProvider>
  </StrictMode>,
);