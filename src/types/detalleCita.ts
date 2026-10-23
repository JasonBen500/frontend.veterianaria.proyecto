export interface DetalleCita {
  idDetalleCita: number | null;
  precioAplicado: number;
  estado: boolean;
  idCita: number;
  idMedicamento: number;
  idTratamiento: number;
  descripcionCita?: string;
  nombreMedicamento?: string;
  nombreTratamiento?: string;
  cantidad?: number;
}
