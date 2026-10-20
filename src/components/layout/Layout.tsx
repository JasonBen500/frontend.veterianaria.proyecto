import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-marca-beige-claro">
      <Sidebar />
      <main className="min-w-0 flex-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;