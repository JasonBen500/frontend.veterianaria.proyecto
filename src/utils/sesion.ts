import type { LoginResponse } from "../types/auth";

const CLAVE = "usuario";

// Lee la sesión guardada. Si el dato está dañado o el navegador no deja leer,
// lo descarta y devuelve null (en vez de romper la app al arrancar).
export function leerSesion(): LoginResponse | null {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return null;
    const dato: unknown = JSON.parse(guardado);
    if (
      dato &&
      typeof dato === "object" &&
      typeof (dato as LoginResponse).token === "string"
    ) {
      return dato as LoginResponse;
    }
  } catch {
    // JSON dañado o almacenamiento no disponible
  }
  borrarSesion();
  return null;
}

export function guardarSesion(data: LoginResponse): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(data));
  } catch {
    // sin almacenamiento: la sesión dura solo mientras la pestaña esté abierta
  }
}

export function borrarSesion(): void {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // nada que borrar
  }
}
