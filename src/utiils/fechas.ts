export const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Del texto que manda el servidor se queda con "AAAA-MM-DD"
export const soloFecha = (fecha: string) => fecha.slice(0, 10);

// Fecha de hoy en la zona horaria del navegador, como "AAAA-MM-DD"
export const hoyTexto = () => {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
};

// "2026-10-20..." -> "20 oct 2026"
export const formatearFecha = (fecha: string) => {
  const [anio, mes, dia] = soloFecha(fecha).split("-");
  const nombreMes = NOMBRES_MESES[Number(mes) - 1].slice(0, 3).toLowerCase();
  return `${Number(dia)} ${nombreMes} ${anio}`;
};