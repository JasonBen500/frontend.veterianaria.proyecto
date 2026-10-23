export interface HojaLinea {
  tipo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface HojaCita {
  idCita: number;
  fecha: string;
  motivo: string;
  nombreDueno?: string;
  telefonoDueno?: string;
  nombreMascota?: string;
  especieMascota?: string;
  nombreMedico?: string;
  especialidadMedico?: string;
  sintomas?: string;
  diagnostico?: string;
  lineas: HojaLinea[];
  total: number;
}