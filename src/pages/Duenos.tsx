import { useState } from "react";
import { LayoutGrid, Rows3, Users } from "lucide-react";
import {
  listarDuenosActivos,
  agregarDueno,
  modificarDueno,
  anularDueno,
} from "../services/duenoService";
import { listarMascotasActivas } from "../services/mascotaService";
import { listarCitasActivas } from "../services/citaService";
import type { Dueno } from "../types/dueno";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalDetalles from "../components/ModalDetalles";
import ModalFormulario from "../components/formulario/ModalFormulario";
import ModalConsulta from "../components/ModalConsulta";
import FiltrosTabla from "../components/FiltrosTabla";
import TarjetaDueno from "../components/duenos/TarjetaDueno";
import BotonIniciarConsulta from "../components/BotonIniciarConsulta";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useDetallesUrl } from "../hooks/useDetallesUrl";
import { useLista } from "../hooks/useLista";
import { useFiltros } from "../hooks/useFiltros";
import { reporteDuenos } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";
import { formatearFechaHora } from "../utils/fechas";
import { mascotasDeDueno, proximaCitaDeDueno } from "../utils/duenos";

const configDuenos: ConfigCrud<Dueno> = {
  listar: listarDuenosActivos,
  agregar: agregarDueno,
  modificar: modificarDueno,
  anular: anularDueno,
  obtenerId: (d) => d.idDueno,
  vacio: {
    idDueno: null,
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    estado: true,
  },
  textos: {
    creado: "Dueño creado correctamente",
    actualizado: "Dueño actualizado correctamente",
    anulado: "Dueño anulado correctamente",
    confirmarAnular: "¿Seguro que deseas anular este dueño?",
    errorListar: "Error al listar dueños",
  },
};

function DuenosPage() {
  const crud = useCrud(configDuenos);
  const detalles = useDetallesUrl();
  const [busqueda, setBusqueda] = useState(detalles.busquedaInicial);
  const [consultaAbierta, setConsultaAbierta] = useState(false);
  const mascotas = useLista(listarMascotasActivas);
  const citas = useLista(listarCitasActivas);
  const [vista, setVista] = useState<"tarjetas" | "tabla">("tarjetas");
  const [limite, setLimite] = useState(12);

  const proxima = (d: Dueno) => proximaCitaDeDueno(d.idDueno, mascotas, citas);
  const susMascotas = (d: Dueno) => mascotasDeDueno(d.idDueno, mascotas);

  const filtros = useFiltros(crud.items, [
    {
      tipo: "select",
      id: "cita",
      etiqueta: "Próxima cita",
      opciones: ["Con cita próxima", "Sin cita próxima"],
      valor: (d) => (proxima(d) ? "Con cita próxima" : "Sin cita próxima"),
    },
    {
      tipo: "select",
      id: "mascotas",
      etiqueta: "Mascotas",
      opciones: ["Con mascotas", "Sin mascotas"],
      valor: (d) => (susMascotas(d).length > 0 ? "Con mascotas" : "Sin mascotas"),
    },
    {
      tipo: "select",
      id: "especie",
      etiqueta: "Especie de sus mascotas",
      valor: (d) => susMascotas(d).map((m) => m.especie),
    },
    {
      tipo: "fecha",
      id: "fechaCita",
      etiqueta: "Fecha de su próxima cita",
      valor: (d) => proxima(d)?.fecha,
    },
  ]);

  const visibles = filtrarPorTexto(filtros.filtrados, busqueda);

  const columnasTabla: ColumnaTabla<Dueno>[] = [
    { encabezado: "Nombre", valor: (d) => d.nombre },
    { encabezado: "Apellido", valor: (d) => d.apellido },
    { encabezado: "Dirección", valor: (d) => d.direccion },
    { encabezado: "Telefono", valor: (d) => d.telefono ?? "—" },
    {
      encabezado: "Mascotas",
      valor: (d) => susMascotas(d).map((m) => m.nombre).join(", ") || "—",
    },
    {
      encabezado: "Próxima cita",
      valor: (d) => {
        const cita = proxima(d);
        return cita ? formatearFechaHora(cita.fecha) : "—";
      },
    },
  ];

  const claseVista = (activa: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-nunito text-sm font-bold transition ${activa
      ? "bg-marca-oscuro text-white"
      : "border-2 border-marca-oscuro text-marca-oscuro hover:bg-marca-oscuro hover:text-white"
    }`;

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina titulo="Dueños" ruta="/duenos" />

      <BarraListado
        titulo="Lista de Dueños"
        exportar={<BotonesExportar {...reporteDuenos} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar nombre, teléfono o dirección..."
        textoBoton="Nuevo Dueño"
        onNuevo={crud.abrirNuevo}
      />

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setVista("tarjetas")}
          className={claseVista(vista === "tarjetas")}
        >
          <LayoutGrid size={16} />
          Tarjetas
        </button>
        <button
          type="button"
          onClick={() => setVista("tabla")}
          className={claseVista(vista === "tabla")}
        >
          <Rows3 size={16} />
          Tabla
        </button>
      </div>

      {vista === "tabla" ? (
        <TablaDatos
          columnas={columnasTabla}
          datos={visibles}
          claveFila={(d) => d.idDueno}
          acciones={(d) => (
            <AccionesFila
              onVerDetalles={() => detalles.ver(d.idDueno!)}
              onEditar={() => crud.handleModificar(d)}
              onAnular={() => d.idDueno !== null && crud.handleAnular(d.idDueno)}
            />
          )}
        />
      ) : visibles.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <Users size={40} className="text-marca-verde" />
          <p className="font-nunito text-sm font-bold text-marca-oscuro/60">
            No hay dueños para mostrar.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibles.slice(0, limite).map((d) => (
              <TarjetaDueno
                key={d.idDueno}
                dueno={d}
                mascotas={susMascotas(d)}
                proximaCita={proxima(d)}
                onVerDetalles={() => detalles.ver(d.idDueno!)}
                onEditar={() => crud.handleModificar(d)}
                onAnular={() =>
                  d.idDueno !== null && crud.handleAnular(d.idDueno)
                }
              />
            ))}
          </div>
          {visibles.length > limite && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setLimite((prev) => prev + 12)}
                className="rounded-full border-2 border-marca-oscuro px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white"
              >
                Mostrar más ({visibles.length - limite} restantes)
              </button>
            </div>
          )}
        </>
      )}

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR DATOS" : "NUEVO DUEÑO"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información del dueño:"
            : "Ingresa los datos del nuevo dueño:"
        }
        icono={Users}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:">
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Juan Carlos"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Apellido:">
          <input
            name="apellido"
            value={crud.form.apellido}
            onChange={crud.handleChange}
            placeholder="Ej. Pérez Gómez"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Teléfono:">
          <input
            name="telefono"
            value={crud.form.telefono}
            onChange={crud.handleChange}
            placeholder="Ej. 1234-5678"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Dirección:">
          <input
            name="direccion"
            value={crud.form.direccion}
            onChange={crud.handleChange}
            placeholder="Ej. Av. Siempreviva 742"
            className={CLASE_INPUT}
          />
        </Campo>
      </ModalFormulario>

      <ModalDetalles
        abierto={detalles.abierto}
        id={detalles.id}
        entity="duenos"
        configReporte={reporteDuenos}
        icono={Users}
        subtitulo="Información completa del dueño"
        onCerrar={detalles.cerrar}
        acciones={
          <BotonIniciarConsulta
            onClick={() => {
              detalles.cerrar();
              setConsultaAbierta(true);
            }}
          />
        }
      />
      <ModalConsulta
        abierto={consultaAbierta}
        idDueno={detalles.id}
        onCerrar={() => setConsultaAbierta(false)}
      />
    </div>
  );
}

export default DuenosPage;
