import api from "../api/axios";
import type { DetalleCita } from "../types/detalleCita";

export const listarDetallesActivos = () =>
  api.get<DetalleCita[]>("/detalle-citas/activos");
export const agregarDetalleCita = (data: Omit<DetalleCita, "idDetalleCita">) =>
  api.post("/detalle-citas", data);
export const modificarDetalleCita = (
  id: number,
  data: Omit<DetalleCita, "idDetalleCita">,
) => api.put(`/detalle-citas/${id}`, data);
export const anularDetalleCita = (id: number) =>
  api.patch(`/detalle-citas/${id}/anular`);
