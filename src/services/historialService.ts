import api from "../api/axios";
import type { Historial } from "../types/historial";

export const listarHistorial = () => api.get<Historial[]>("/historial");
export const listarUltimosMovimientos = () =>
  api.get<Historial[]>("/historial/ultimos");