import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RutaProtegida from "./components/RutaProtegida";
import LoginPage from "./pages/Login";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import DuenosPage from "./pages/Duenos";
import MascotasPage from "./pages/Mascotas";
import CitasPage from "./pages/Citas";
import ConsultasPage from "./pages/Consultas";
import DetalleCitasPage from "./pages/DetalleCitas";
import MedicamentosPage from "./pages/Medicamentos";
import TratamientosPage from "./pages/Tratamientos";
import MedicosPage from "./pages/Medicos";
import UsuariosPage from "./pages/Usuarios";
import PerfilesPage from "./pages/Perfiles";
import Reportes from "./pages/Reportes";
import Administracion from "./pages/Administracion";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
        <Route path="/administracion" element={<Administracion />} />
      </Route>
    </Routes>
  );
}

export default App;
