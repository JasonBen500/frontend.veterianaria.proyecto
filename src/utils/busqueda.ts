import { NOMBRES_MESES } from "./fechas";

// Quita tildes y pasa a minúsculas para comparar sin importar cómo se escriba
export const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Solo se busca en textos cortos (así se ignora la imagen en base64) y números
const esBuscable = (valor: unknown): valor is string | number =>
  typeof valor === "number" ||
  (typeof valor === "string" && valor.length < 200);

const ES_FECHA = /^(\d{4})-(\d{2})-(\d{2})/;

// Si el texto es una fecha "2026-10-20", agrega cómo se ve en pantalla
// ("20 oct 2026") y el nombre completo del mes ("octubre")
function conFechaLegible(texto: string): string {
  const partes = ES_FECHA.exec(texto);
  if (!partes) return texto;

  const [, anio, mes, dia] = partes;
  const nombreMes = NOMBRES_MESES[Number(mes) - 1];
  if (!nombreMes) return texto;

  return `${texto} ${Number(dia)} ${nombreMes.slice(0, 3)} ${anio} ${nombreMes}`;
}

// Junta en un solo texto todos los campos buscables de la fila
// (se ignoran los campos id: idDueno, idCita, ...)
function textoDeFila(fila: object): string {
  return Object.entries(fila)
    .filter(([clave, valor]) => !/^id[A-Z]/.test(clave) && esBuscable(valor))
    .map(([, valor]) => conFechaLegible(String(valor)))
    .join(" ");
}

// Filtra cualquier lista. Cada palabra escrita debe aparecer en alguno de los
// campos de la fila (en cualquier orden): "juan perez" encuentra a Juan Pérez.
export function filtrarPorTexto<T extends object>(
  datos: T[],
  busqueda: string,
): T[] {
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return datos;

  return datos.filter((fila) => {
    const texto = normalizar(textoDeFila(fila));
    return palabras.every((palabra) => texto.includes(palabra));
  });
}