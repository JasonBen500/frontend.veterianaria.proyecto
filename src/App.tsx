import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RutaProtegida from "./components/RutaProtegida";
import Cargando from "./components/Cargando";
const LoginPage = lazy(() => import("./pages/Login"));
const PaginaPrincipal = lazy(() => import("./pages/PaginaPrincipal"));
const DuenosPage = lazy(() => import("./pages/Duenos"));
const MascotasPage = lazy(() => import("./pages/Mascotas"));
const CitasPage = lazy(() => import("./pages/Citas"));
const ConsultasPage = lazy(() => import("./pages/Consultas"));
const DetalleCitasPage = lazy(() => import("./pages/DetalleCitas"));
const MedicamentosPage = lazy(() => import("./pages/Medicamentos"));
const TratamientosPage = lazy(() => import("./pages/Tratamientos"));
const MedicosPage = lazy(() => import("./pages/Medicos"));
const UsuariosPage = lazy(() => import("./pages/Usuarios"));
const PerfilesPage = lazy(() => import("./pages/Perfiles"));
const Reportes = lazy(() => import("./pages/Reportes"));
const HistorialPage = lazy(() => import("./pages/Historial"));
const Administracion = lazy(() => import("./pages/Administracion"));
const NoEncontradoPage = lazy(() => import("./pages/NoEncontrado"));

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<Cargando />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* Todas las páginas con sesión comparten el sidebar */}
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/duenos" element={<DuenosPage />} />
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/detalle-citas" element={<DetalleCitasPage />} />
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/tratamientos" element={<TratamientosPage />} />
        <Route path="/medicos" element={<MedicosPage />} />
        <Route
          path="/usuarios"
          element={
            <RutaProtegida soloAdmin>
              <UsuariosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfiles"
          element={
            <RutaProtegida soloAdmin>
              <PerfilesPage />
            </RutaProtegida>
          }
        />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route path="*" element={<NoEncontradoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
