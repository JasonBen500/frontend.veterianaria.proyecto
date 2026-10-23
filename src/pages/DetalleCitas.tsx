import { useState, type ChangeEvent } from "react";
import { ClipboardList } from "lucide-react";
import {
  listarDetallesActivos,
  agregarDetalleCita,
  modificarDetalleCita,
  anularDetalleCita,
} from "../services/detalleCitaService";
import { listarCitasActivas } from "../services/citaService";
import { listarMedicamentosActivos } from "../services/medicamentosService";
import { listarTratamientosActivos } from "../services/tratamientoService";
import type { DetalleCita } from "../types/detalleCita";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useLista } from "../hooks/useLista";
import { reporteDetalleCitas } from "../utils/reportes";
import { etiquetaCita } from "../utils/citas";
import { filtrarPorTexto } from "../utils/busqueda";

type TipoDetalle = "medicamento" | "tratamiento";

type PayloadDetalle = Omit<DetalleCita, "idDetalleCita">;

// El backend espera null/ausente en lo que no aplica (no un 0)
const aPayload = (d: DetalleCita): PayloadDetalle =>
  ({
    precioAplicado: d.precioAplicado,
    estado: d.estado,
    idCita: d.idCita,
    idMedicamento: d.idMedicamento || undefined,
    idTratamiento: d.idTratamiento || undefined,
    cantidad: d.cantidad ?? 1,
  }) as PayloadDetalle;

const configDetalles: ConfigCrud<DetalleCita> = {
  listar: listarDetallesActivos,
  agregar: (d) => agregarDetalleCita(aPayload(d)),
  modificar: (id, d) => modificarDetalleCita(id, aPayload(d)),
  anular: anularDetalleCita,
  obtenerId: (d) => d.idDetalleCita,
  camposNumericos: [
    "precioAplicado",
    "idCita",
    "idMedicamento",
    "idTratamiento",
    "cantidad",
  ],
  vacio: {
    idDetalleCita: null,
    precioAplicado: 0,
    estado: true,
    idCita: 0,
    idMedicamento: 0,
    idTratamiento: 0,
    cantidad: 1,
  },
  textos: {
    creado: "Detalle creado correctamente",
    actualizado: "Detalle actualizado correctamente",
    anulado: "Detalle anulado correctamente",
    confirmarAnular:
      "¿Seguro que deseas anular este detalle? Si es un medicamento, su stock se devuelve al inventario.",
    errorListar: "Error al listar detalles de cita",
  },
};

const subtotal = (d: DetalleCita) =>
  Number(d.precioAplicado) * (d.cantidad ?? 1);

const columnasTabla: ColumnaTabla<DetalleCita>[] = [
  { encabezado: "Cita", valor: (d) => d.descripcionCita ?? `Cita #${d.idCita}` },
  {
    encabezado: "Tipo",
    valor: (d) => (d.idMedicamento ? "Medicamento" : "Tratamiento"),
  },
  {
    encabezado: "Concepto",
    valor: (d) => d.nombreMedicamento ?? d.nombreTratamiento ?? "—",
  },
  { encabezado: "Cantidad", valor: (d) => d.cantidad ?? 1 },
  {
    encabezado: "Precio",
    valor: (d) => `Q ${Number(d.precioAplicado).toFixed(2)}`,
  },
  { encabezado: "Subtotal", valor: (d) => `Q ${subtotal(d).toFixed(2)}` },
];

function DetalleCitasPage() {
  const crud = useCrud(configDetalles);
  const citas = useLista(listarCitasActivas);
  const medicamentos = useLista(listarMedicamentosActivos);
  const tratamientos = useLista(listarTratamientosActivos);

  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState<TipoDetalle>("medicamento");

  const medicamentoElegido = medicamentos.find(
    (m) => m.idMedicamento === crud.form.idMedicamento,
  );

  const nuevo = () => {
    setTipo("medicamento");
    crud.abrirNuevo();
  };

  const editar = (detalle: DetalleCita) => {
    setTipo(detalle.idMedicamento ? "medicamento" : "tratamiento");
    crud.handleModificar(detalle);
  };

  // Al cambiar de tipo se limpia lo elegido del otro tipo
  const cambiarTipo = (nuevoTipo: TipoDetalle) => {
    setTipo(nuevoTipo);
    crud.setForm((prev) => ({
      ...prev,
      idMedicamento: 0,
      idTratamiento: 0,
      cantidad: 1,
      precioAplicado: 0,
    }));
  };

  // Al elegir el concepto se propone su precio (se puede editar)
  const elegirMedicamento = (e: ChangeEvent<HTMLSelectElement>) => {
    crud.handleChange(e);
    const elegido = medicamentos.find(
      (m) => m.idMedicamento === Number(e.target.value),
    );
    if (elegido) {
      crud.setForm((prev) => ({ ...prev, precioAplicado: elegido.precio }));
    }
  };

  const elegirTratamiento = (e: ChangeEvent<HTMLSelectElement>) => {
    crud.handleChange(e);
    const elegido = tratamientos.find(
      (t) => t.idTratamiento === Number(e.target.value),
    );
    if (elegido) {
      crud.setForm((prev) => ({ ...prev, precioAplicado: elegido.precio }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina titulo="Detalles de Cita" ruta="/detalle-citas" />

      <BarraListado
        titulo="Listado de Detalles de Cita"
        exportar={
          <BotonesExportar {...reporteDetalleCitas} datos={crud.items} />
        }
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por cita, medicamento o tratamiento..."
        textoBoton="Nuevo Detalle"
        onNuevo={nuevo}
      />

      <Mensaje texto={crud.mensaje} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(crud.items, busqueda)}
        claveFila={(d) => d.idDetalleCita}
        acciones={(d) => (
          <AccionesFila
            onEditar={() => editar(d)}
            onAnular={() =>
              d.idDetalleCita !== null && crud.handleAnular(d.idDetalleCita)
            }
          />
        )}
      />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR DETALLE" : "NUEVO DETALLE"}
        subtitulo={
          crud.modoEdicion
            ? "Edita el medicamento o tratamiento de la cita:"
            : "Agrega un medicamento o tratamiento a una cita:"
        }
        icono={ClipboardList}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Cita:" className="md:col-span-2">
          <select
            name="idCita"
            value={crud.form.idCita === 0 ? "" : crud.form.idCita}
            onChange={crud.handleChange}
            required
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione la cita...
            </option>
            {citas.map((c) => (
              <option
                key={c.idCita}
                value={c.idCita ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {etiquetaCita(c)}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Tipo:">
          <select
            value={tipo}
            onChange={(e) => cambiarTipo(e.target.value as TipoDetalle)}
            className={CLASE_SELECT}
          >
            <option value="medicamento">Medicamento</option>
            <option value="tratamiento">Tratamiento</option>
          </select>
        </Campo>

        {tipo === "medicamento" ? (
          <Campo etiqueta="Medicamento:">
            <select
              name="idMedicamento"
              value={crud.form.idMedicamento || ""}
              onChange={elegirMedicamento}
              required
              className={CLASE_SELECT}
            >
              <option value="" disabled className="bg-marca-beige-claro">
                Seleccione un medicamento...
              </option>
              {medicamentos.map((m) => (
                <option
                  key={m.idMedicamento}
                  value={m.idMedicamento ?? undefined}
                  className="bg-marca-beigeclaro2"
                >
                  {m.nombre}
                </option>
              ))}
            </select>
          </Campo>
        ) : (
          <Campo etiqueta="Tratamiento:">
            <select
              name="idTratamiento"
              value={crud.form.idTratamiento || ""}
              onChange={elegirTratamiento}
              required
              className={CLASE_SELECT}
            >
              <option value="" disabled className="bg-marca-beige-claro">
                Seleccione un tratamiento...
              </option>
              {tratamientos.map((t) => (
                <option
                  key={t.idTratamiento}
                  value={t.idTratamiento ?? undefined}
                  className="bg-marca-beigeclaro2"
                >
                  {t.nombre}
                </option>
              ))}
            </select>
          </Campo>
        )}

        {tipo === "medicamento" && (
          <Campo etiqueta="Cantidad:">
            <input
              type="number"
              name="cantidad"
              value={crud.form.cantidad ?? 1}
              onChange={crud.handleChange}
              min={1}
              className={CLASE_INPUT}
            />
            {medicamentoElegido && (
              <p className="mt-1 text-sm font-nunito text-gray-500">
                Stock disponible: {medicamentoElegido.stock}
              </p>
            )}
          </Campo>
        )}

        <Campo etiqueta="Precio aplicado (Q):">
          <input
            type="number"
            name="precioAplicado"
            value={crud.form.precioAplicado === 0 ? "" : crud.form.precioAplicado}
            onChange={crud.handleChange}
            min={0.01}
            step="0.01"
            required
            placeholder="0.00"
            className={CLASE_INPUT}
          />
        </Campo>
      </ModalFormulario>
    </div>
  );
}

export default DetalleCitasPage;
