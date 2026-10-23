import axios from "axios";

// Devuelve el mensaje que envía el backend (campo "mensaje") o uno genérico
export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.mensaje ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}
