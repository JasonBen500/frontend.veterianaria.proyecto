import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Nabvar";
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

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/duenos" replace />} />
        <Route path="/duenos" element={<DuenosPage />} />
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/detalle-citas" element={<DetalleCitasPage />} />
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/tratamientos" element={<TratamientosPage />} />
        <Route path="/medicos" element={<MedicosPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/perfiles" element={<PerfilesPage />} />
      </Routes>
    </div>
  );
}

export default App;
