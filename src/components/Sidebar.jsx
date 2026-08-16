import {
  Home,
  Search,
  Library,
  ListMusic,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const playlistsActive =
    location.pathname === "/playlists" ||
    location.pathname.startsWith("/playlist/");

  const getNavClass = ({ isActive }) =>
    isActive ? "active" : "";

  return (
    <aside className="sidebar">
      <div className="logo">Melody</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={getNavClass}
          aria-label="Home"
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={getNavClass}
          aria-label="Search"
        >
          <Search size={20} />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/library"
          className={getNavClass}
          aria-label="Your Library"
        >
          <Library size={20} />
          <span>Your Library</span>
        </NavLink>

        <NavLink
          to="/playlists"
          className={() =>
            playlistsActive ? "active" : ""
          }
          aria-label="Playlists"
        >
          <ListMusic size={20} />
          <span>Playlists</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;