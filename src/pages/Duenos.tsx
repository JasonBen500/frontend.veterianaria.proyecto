import { useState } from "react";
import { Users } from "lucide-react";
import {
  listarDuenosActivos,
  agregarDueno,
  modificarDueno,
  anularDueno,
} from "../services/duenoService";
import type { Dueno } from "../types/dueno";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalDetalles from "../components/ModalDetalles";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useDetallesUrl } from "../hooks/useDetallesUrl";
import { reporteDuenos } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";

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

const columnasTabla: ColumnaTabla<Dueno>[] = [
  { encabezado: "Nombre", valor: (d) => d.nombre },
  { encabezado: "Apellido", valor: (d) => d.apellido },
  { encabezado: "Dirección", valor: (d) => d.direccion },
  { encabezado: "Telefono", valor: (d) => d.telefono ?? "—" },
];

function DuenosPage() {
  const crud = useCrud(configDuenos);
  const detalles = useDetallesUrl();
  const [busqueda, setBusqueda] = useState(detalles.busquedaInicial);

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

      <Mensaje texto={crud.mensaje} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(crud.items, busqueda)}
        claveFila={(d) => d.idDueno}
        acciones={(d) => (
          <AccionesFila
            onVerDetalles={() => detalles.ver(d.idDueno!)}
            onEditar={() => crud.handleModificar(d)}
            onAnular={() => d.idDueno !== null && crud.handleAnular(d.idDueno)}
          />
        )}
      />

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
      />
    </div>
  );
}

export default DuenosPage;
