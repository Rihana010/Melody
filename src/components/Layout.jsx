import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>

      <Player />
    </div>
  );
}

export default Layout;