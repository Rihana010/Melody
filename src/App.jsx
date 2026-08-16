import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Album from "./pages/Album";
import Playlists from "./pages/Playlists";
import Playlist from "./pages/Playlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/search" element={<Search />} />

          <Route path="/library" element={<Library />} />

          <Route path="/album/:id" element={<Album />} />

          <Route path="/playlists" element={<Playlists />} />

          <Route
            path="/playlist/:id"
            element={<Playlist />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;