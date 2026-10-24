import { CircleCheck, CircleAlert } from "lucide-react";

// Todos los avisos de éxito de la app dicen "... correctamente";
// cualquier otro texto (errores del servidor incluidos) se muestra como error
const ES_EXITO = /correctamente|con éxito|exitosamente/i;

function Mensaje({ texto }: { texto: string }) {
  if (!texto) return null;
  const esExito = ES_EXITO.test(texto);
  const Icono = esExito ? CircleCheck : CircleAlert;

  return (
    <p
      role={esExito ? "status" : "alert"}
      className={`mb-4 flex items-center gap-2 rounded-2xl border px-4 py-3 font-nunito text-sm font-bold ${
        esExito
          ? "border-marca-verde bg-marca-verde/20 text-marca-oscuro"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <Icono size={18} className="shrink-0" />
      {texto}
    </p>
  );
}

export default Mensaje;