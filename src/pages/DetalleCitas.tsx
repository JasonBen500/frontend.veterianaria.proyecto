import { useState } from "react";
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
import FiltrosTabla from "../components/FiltrosTabla";
import FormularioDetalle, {
  type TipoDetalle,
} from "../components/detalles/FormularioDetalle";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useLista } from "../hooks/useLista";
import { useFiltros } from "../hooks/useFiltros";
import { reporteDetalleCitas } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";

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
  { encabezado: "Cita", valor: (d) => d.descripcionCita ?? "—" },
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

  const filtros = useFiltros(crud.items, [
    {
      tipo: "select",
      id: "tipo",
      etiqueta: "Tipo",
      opciones: ["Medicamento", "Tratamiento"],
      valor: (d) => (d.idMedicamento ? "Medicamento" : "Tratamiento"),
    },
    {
      tipo: "select",
      id: "concepto",
      etiqueta: "Concepto",
      valor: (d) => d.nombreMedicamento ?? d.nombreTratamiento,
    },
    { tipo: "select", id: "cita", etiqueta: "Cita", valor: (d) => d.descripcionCita },
    { tipo: "numero", id: "precio", etiqueta: "Precio (Q)", valor: (d) => d.precioAplicado },
  ]);

  const nuevo = () => {
    setTipo("medicamento");
    crud.abrirNuevo();
  };

  const editar = (detalle: DetalleCita) => {
    setTipo(detalle.idMedicamento ? "medicamento" : "tratamiento");
    crud.handleModificar(detalle);
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

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(filtros.filtrados, busqueda)}
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

      <FormularioDetalle
        abierto={crud.modalAbierto}
        modoEdicion={crud.modoEdicion}
        mensaje={crud.mensaje}
        form={crud.form}
        setForm={crud.setForm}
        onChange={crud.handleChange}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
        tipo={tipo}
        onCambiarTipo={setTipo}
        citas={citas}
        medicamentos={medicamentos}
        tratamientos={tratamientos}
      />
    </div>
  );
}

export default DetalleCitasPage;
