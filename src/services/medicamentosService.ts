import api from "../api/axios";
import type { Medicamentos } from "../types/medicamentos";

export const listarMedicamentosActivos = () =>
  api.get<Medicamentos[]>("/medicamentos/activos");
export const agregarMedicamento = (data: Omit<Medicamentos, "idMedicamento">) =>
  api.post("/medicamentos", data);
export const modificarMedicamento = (
  id: number,
  data: Omit<Medicamentos, "idMedicamento">,
) => api.put(`/medicamentos/${id}`, data);
export const anularMedicamento = (id: number) =>
  api.patch(`/medicamentos/${id}/anular`);
export const eliminarMedicamento = (id: number) =>
  api.delete(`/medicamentos/${id}`);
export const listarMedicamentosTodos = () =>
  api.get<Medicamentos[]>("/medicamentos");
export const ajustarStockMedicamento = (id: number, cambio: number) =>
  api.patch<Medicamentos>(`/medicamentos/${id}/stock`, null, {
    params: { cambio },
  });