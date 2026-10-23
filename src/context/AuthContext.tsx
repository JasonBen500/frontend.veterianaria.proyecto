import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoginResponse } from "../types/auth";

interface AuthContextType {
  usuario: LoginResponse | null;
  esAdmin: boolean;
  iniciarSesion: (data: LoginResponse) => void;
  cerrarSesion: () => void;
}

// Debe coincidir con app.perfil-admin del backend (se compara sin acentos ni mayúsculas)
const PERFIL_ADMIN = import.meta.env.VITE_PERFIL_ADMIN ?? "Administrador";

const normalizar = (texto: string | undefined | null) =>
  (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<LoginResponse | null>(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  const iniciarSesion = (data: LoginResponse) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const esAdmin =
    !!usuario && normalizar(usuario.nombrePerfil) === normalizar(PERFIL_ADMIN);

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
