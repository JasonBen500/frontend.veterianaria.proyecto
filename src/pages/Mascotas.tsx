import { useState } from "react";
import { PawPrint } from "lucide-react";
import {
  listarMascotasActivas,
  agregarMascota,
  modificarMascota,
  anularMascota,
} from "../services/mascotaService";
import { listarDuenosActivos } from "../services/duenoService";
import type { Mascota } from "../types/mascota";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import TablaDatos, { type ColumnaTabla } from "../components/TablaDatos";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import ModalDetalles from "../components/ModalDetalles";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useLista } from "../hooks/useLista";
import { useDetallesUrl } from "../hooks/useDetallesUrl";
import { reporteMascotas } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";

const configMascotas: ConfigCrud<Mascota> = {
  listar: listarMascotasActivas,
  agregar: agregarMascota,
  modificar: modificarMascota,
  anular: anularMascota,
  obtenerId: (m) => m.idMascota,
  camposNumericos: ["edad", "peso", "idDueno"],
  vacio: {
    idMascota: null,
    nombre: "",
    especie: "",
    edad: 0,
    peso: 0,
    estado: true,
    idDueno: 0,
  },
  textos: {
    creado: "Mascota creada correctamente",
    actualizado: "Mascota actualizada correctamente",
    anulado: "Mascota anulada correctamente",
    confirmarAnular: "¿Seguro que deseas anular esta mascota?",
    errorListar: "Error al listar mascotas",
  },
};

const columnasTabla: ColumnaTabla<Mascota>[] = [
  { encabezado: "Nombre", valor: (m) => m.nombre },
  { encabezado: "Especie", valor: (m) => m.especie },
  { encabezado: "Edad", valor: (m) => `${m.edad} meses` },
  { encabezado: "Peso", valor: (m) => `${m.peso} kg` },
  {
    encabezado: "Dueño",
    valor: (m) => (m.nombreDueno ? `${m.idDueno}. ${m.nombreDueno}` : "—"),
  },
];

const CLASE_SUFIJO =
  "absolute right-3 text-gray-400 font-nunito font-semibold select-none pointer-events-none";

function MascotasPage() {
  const crud = useCrud(configMascotas);
  const duenos = useLista(listarDuenosActivos);
  const detalles = useDetallesUrl();
  const [busqueda, setBusqueda] = useState(detalles.busquedaInicial);

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina titulo="Mascotas" ruta="/mascotas" />

      <BarraListado
        titulo="Lista de Mascotas"
        exportar={<BotonesExportar {...reporteMascotas} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar nombre, especie o dueño..."
        textoBoton="Nueva Mascota"
        onNuevo={crud.abrirNuevo}
      />

      <Mensaje texto={crud.mensaje} />

      <TablaDatos
        columnas={columnasTabla}
        datos={filtrarPorTexto(crud.items, busqueda)}
        claveFila={(m) => m.idMascota}
        acciones={(m) => (
          <AccionesFila
            onVerDetalles={() => detalles.ver(m.idMascota!)}
            onEditar={() => crud.handleModificar(m)}
            onAnular={() =>
              m.idMascota !== null && crud.handleAnular(m.idMascota)
            }
          />
        )}
      />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR MASCOTA" : "NUEVA MASCOTA"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información de la mascota:"
            : "Ingresa los datos de la nueva mascota:"
        }
        icono={PawPrint}
        mensaje={crud.mensaje}
        claseGrid="grid-cols-1 md:grid-cols-3"
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:">
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Firulais"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Especie:">
          <input
            name="especie"
            value={crud.form.especie}
            onChange={crud.handleChange}
            placeholder="Ej. Canino"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Edad (meses):" className="relative">
          <div className="flex items-center">
            <input
              type="number"
              name="edad"
              value={crud.form.edad === 0 ? "" : crud.form.edad}
              onChange={crud.handleChange}
              min={0}
              placeholder="Ej. 3"
              className={CLASE_INPUT}
            />
            <span className={CLASE_SUFIJO}>meses</span>
          </div>
        </Campo>
        <Campo etiqueta="Peso (kg):" className="relative">
          <div className="flex items-center">
            <input
              type="number"
              name="peso"
              value={crud.form.peso === 0 ? "" : crud.form.peso}
              onChange={crud.handleChange}
              min={0}
              step="0.1"
              placeholder="Ej. 12.5"
              className={CLASE_INPUT}
            />
            <span className={CLASE_SUFIJO}>kg</span>
          </div>
        </Campo>
        <Campo etiqueta="Dueño:" className="md:col-span-2">
          <select
            name="idDueno"
            value={crud.form.idDueno === 0 ? "" : crud.form.idDueno}
            onChange={crud.handleChange}
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un dueño de la lista...
            </option>
            {duenos.map((d) => (
              <option
                key={d.idDueno}
                value={d.idDueno ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {d.idDueno}. {d.nombre} {d.apellido}
              </option>
            ))}
          </select>
        </Campo>
      </ModalFormulario>

      <ModalDetalles
        abierto={detalles.abierto}
        id={detalles.id}
        entity="mascotas"
        configReporte={reporteMascotas}
        icono={PawPrint}
        subtitulo="Información completa de la mascota"
        onCerrar={detalles.cerrar}
      />
    </div>
  );
}

export default MascotasPage;
