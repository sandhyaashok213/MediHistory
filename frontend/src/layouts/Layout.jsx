import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <div className="layout">
      <Navbar />

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;