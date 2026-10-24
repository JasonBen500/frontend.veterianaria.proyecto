import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../ErrorBoundary";
import Cargando from "../Cargando";

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen bg-marca-beige-claro">
      <Sidebar />
      <main className="min-w-0 flex-auto">
        {/* key: al cambiar de página, el error anterior se descarta */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Cargando />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default Layout;
