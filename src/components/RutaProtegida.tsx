import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  soloAdmin?: boolean;
}

function RutaProtegida({ children, soloAdmin = false }: Props) {
  const { usuario, esAdmin } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default RutaProtegida;
