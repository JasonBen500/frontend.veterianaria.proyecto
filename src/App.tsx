import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Nabvar";
import RutaProtegida from "./components/RutaProtegida";
import LoginPage from "./pages/Login";
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
import { useAuth } from "./context/AuthContext";
import RegistroWizard from "./pages/RegistroWizard";

function App() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/duenos" replace />} />
        <Route
          path="/duenos"
          element={
            <RutaProtegida>
              <DuenosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/mascotas"
          element={
            <RutaProtegida>
              <MascotasPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/citas"
          element={
            <RutaProtegida>
              <CitasPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/consultas"
          element={
            <RutaProtegida>
              <ConsultasPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/detalle-citas"
          element={
            <RutaProtegida>
              <DetalleCitasPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/medicamentos"
          element={
            <RutaProtegida>
              <MedicamentosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/tratamientos"
          element={
            <RutaProtegida>
              <TratamientosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/medicos"
          element={
            <RutaProtegida>
              <MedicosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RutaProtegida>
              <UsuariosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfiles"
          element={
            <RutaProtegida>
              <PerfilesPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/registro"
          element={
            <RutaProtegida>
              <RegistroWizard />
            </RutaProtegida>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
