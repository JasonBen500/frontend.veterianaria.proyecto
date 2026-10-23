import { textoFecha, type ColumnaExportacion } from "./exportar";
import type { Dueno } from "../types/dueno";
import type { Mascota } from "../types/mascota";
import type { Cita } from "../types/cita";
import type { Consulta } from "../types/consulta";
import type { DetalleCita } from "../types/detalleCita";
import type { Medicamentos } from "../types/medicamentos";
import type { Tratamiento } from "../types/tratamiento";
import type { Medico } from "../types/medico";
import type { Usuarios } from "../types/usuarios";
import type { Perfil } from "../types/perfil";

export interface DefinicionReporte<T> {
  titulo: string;
  nombreArchivo: string;
  columnas: ColumnaExportacion<T>[];
  logoBase64?: string;
}

export const reporteDuenos: DefinicionReporte<Dueno> = {
  titulo: "Reporte de dueños",
  nombreArchivo: "duenos",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Apellido", llavePropiedad: "apellido" },
    { encabezado: "Teléfono", llavePropiedad: "telefono" },
    { encabezado: "Dirección", llavePropiedad: "direccion" },
  ],
};

export const reporteMascotas: DefinicionReporte<Mascota> = {
  titulo: "Reporte de mascotas",
  nombreArchivo: "mascotas",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Especie", llavePropiedad: "especie" },
    { encabezado: "Edad", llavePropiedad: "edad" },
    { encabezado: "Peso (kg)", llavePropiedad: "peso" },
    { encabezado: "Dueño", llavePropiedad: "nombreDueno" },
  ],
};

export const reporteCitas: DefinicionReporte<Cita> = {
  titulo: "Reporte de citas",
  nombreArchivo: "citas",
  columnas: [
    { encabezado: "Fecha", llavePropiedad: "fecha", formato: textoFecha },
    { encabezado: "Motivo", llavePropiedad: "motivo" },
    { encabezado: "Total", llavePropiedad: "total" },
    { encabezado: "Mascota", llavePropiedad: "nombreMascota" },
    { encabezado: "Médico", llavePropiedad: "nombreMedico" },
    { encabezado: "Registrada por", llavePropiedad: "nombreUsuario" },
  ],
};

export const reporteConsultas: DefinicionReporte<Consulta> = {
  titulo: "Reporte de consultas",
  nombreArchivo: "consultas",
  columnas: [
    { encabezado: "Cita", llavePropiedad: "descripcionCita" },
    { encabezado: "Diagnóstico", llavePropiedad: "diagnostico" },
    { encabezado: "Síntomas", llavePropiedad: "sintomas" },
  ],
};

export const reporteDetalleCitas: DefinicionReporte<DetalleCita> = {
  titulo: "Reporte de detalles de cita",
  nombreArchivo: "detalle-citas",
  columnas: [
    { encabezado: "Cita", llavePropiedad: "descripcionCita" },
    { encabezado: "Medicamento", llavePropiedad: "nombreMedicamento" },
    { encabezado: "Tratamiento", llavePropiedad: "nombreTratamiento" },
    { encabezado: "Precio aplicado", llavePropiedad: "precioAplicado" },
  ],
};

export const reporteMedicamentos: DefinicionReporte<Medicamentos> = {
  titulo: "Reporte de medicamentos",
  nombreArchivo: "medicamentos",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Descripción", llavePropiedad: "descripcion" },
    { encabezado: "Precio", llavePropiedad: "precio" },
    { encabezado: "Stock", llavePropiedad: "stock" },
  ],
};

export const reporteTratamientos: DefinicionReporte<Tratamiento> = {
  titulo: "Reporte de tratamientos",
  nombreArchivo: "tratamientos",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Precio", llavePropiedad: "precio" },
  ],
};

export const reporteMedicos: DefinicionReporte<Medico> = {
  titulo: "Reporte de médicos",
  nombreArchivo: "medicos",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Apellido", llavePropiedad: "apellido" },
    { encabezado: "Cédula", llavePropiedad: "cedula" },
    { encabezado: "Especialidad", llavePropiedad: "especialidad" },
    { encabezado: "Usuario", llavePropiedad: "nombreUsuario" },
  ],
};

export const reporteUsuarios: DefinicionReporte<Usuarios> = {
  titulo: "Reporte de usuarios",
  nombreArchivo: "usuarios",
  columnas: [
    { encabezado: "Nombre", llavePropiedad: "nombre" },
    { encabezado: "Usuario", llavePropiedad: "usuario" },
    { encabezado: "Correo", llavePropiedad: "correo" },
    { encabezado: "Perfil", llavePropiedad: "nombrePerfil" },
  ],
};

export const reportePerfiles: DefinicionReporte<Perfil> = {
  titulo: "Reporte de perfiles",
  nombreArchivo: "perfiles",
  columnas: [{ encabezado: "Nombre del perfil", llavePropiedad: "nombrePerfil" }],
};