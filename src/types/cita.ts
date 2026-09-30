export interface Cita {
  idCita: number | null;
  fecha: string;
  motivo: string;
  total: number;
  estado: boolean;
  idMascota: number;
  idMedico: number;
  idUsuario: number;
}
