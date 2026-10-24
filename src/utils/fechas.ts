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

// "2026-10-23T15:30:00..." -> "23 oct 2026, 03:30 p. m."
export const fechaHora = (fecha: string) =>
  new Date(fecha).toLocaleString("es-GT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// "2026-10-20T14:30..." -> "14:30"
export const formatearHora = (fecha: string) => {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
};

// "20 oct 2026 · 14:30"
export const formatearFechaHora = (fecha: string) => {
  const hora = formatearHora(fecha);
  return hora ? `${formatearFecha(fecha)} · ${hora}` : formatearFecha(fecha);
};
