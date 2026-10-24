import { useState } from "react";
import { Syringe } from "lucide-react";
import {
  listarTratamientosActivos,
  agregarTratamiento,
  modificarTratamiento,
  anularTratamiento,
} from "../services/tratamientoService";
import type { Tratamiento } from "../types/tratamiento";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import FiltrosTabla from "../components/FiltrosTabla";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { reporteTratamientos } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";
import { useFiltros } from "../hooks/useFiltros";

const configTratamientos: ConfigCrud<Tratamiento> = {
  listar: listarTratamientosActivos,
  agregar: agregarTratamiento,
  modificar: modificarTratamiento,
  anular: anularTratamiento,
  obtenerId: (t) => t.idTratamiento,
  camposNumericos: ["precio"],
  vacio: {
    idTratamiento: null,
    nombre: "",
    precio: 0,
    estado: true,
  },
  textos: {
    creado: "Tratamiento creado correctamente",
    actualizado: "Tratamiento actualizado correctamente",
    anulado: "Tratamiento anulado correctamente",
    confirmarAnular: "¿Seguro que deseas anular este tratamiento?",
    errorListar: "Error al listar tratamientos",
  },
};

function TratamientosPage() {
  const crud = useCrud(configTratamientos);
  const [busqueda, setBusqueda] = useState("");

  const filtros = useFiltros(crud.items, [
    { tipo: "numero", id: "precio", etiqueta: "Precio (Q)", valor: (t) => t.precio },
  ]);
  const tratamientosFiltrados = filtrarPorTexto(filtros.filtrados, busqueda);

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Tratamientos"
        ruta="/tratamientos"
        padres={[{ texto: "Administración", ruta: "/administracion" }]}
      />

      <BarraListado
        titulo="Lista"
        exportar={
          <BotonesExportar {...reporteTratamientos} datos={crud.items} />
        }
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre o precio..."
        textoBoton="Nuevo Tratamiento"
        onNuevo={crud.abrirNuevo}
      />

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR TRATAMIENTO" : "NUEVO TRATAMIENTO"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información del tratamiento:"
            : "Ingresa los datos del nuevo tratamiento:"
        }
        icono={Syringe}
        mensaje={crud.mensaje}
        claseGrid="grid-cols-1 md:grid-cols-3"
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:" className="md:col-span-2">
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Limpieza dental"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Precio:">
          <div className="relative w-full flex items-center">
            <span className="absolute left-3 z-10 text-gray-500 font-nunito font-bold select-none pointer-events-none">
              Q
            </span>
            <input
              type="number"
              name="precio"
              value={crud.form.precio === 0 ? "" : crud.form.precio}
              onChange={crud.handleChange}
              min={0}
              step="0.01"
              placeholder="0.00"
              className={`${CLASE_INPUT} pl-8 bg-transparent`}
            />
          </div>
        </Campo>
      </ModalFormulario>

      {tratamientosFiltrados.length === 0 ? (
        <p className="font-nunito text-sm font-semibold text-marca-oscuro/60 text-center mt-8">
          No hay tratamientos para mostrar.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {tratamientosFiltrados.map((t) => (
            <div
              key={t.idTratamiento}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg shadow-marca-cafenigga/15 hover:shadow-xl transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 rounded-full bg-marca-beigeclaro2 border border-marca-oscuro/20 flex items-center justify-center text-marca-oscuro shrink-0 shadow-inner">
                  <Syringe size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-nunito font-extrabold text-lg text-gray-800 truncate">
                    {t.nombre}
                  </h3>
                  <p className="text-base font-nunito font-bold text-marca-verdehoja mt-0.5">
                    Q {t.precio.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-px h-px sm:h-12 bg-marca-oscuro/15 my-1 sm:my-0" />

              <div className="flex items-center justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <AccionesFila
                  onEditar={() => crud.handleModificar(t)}
                  onAnular={() =>
                    t.idTratamiento !== null &&
                    crud.handleAnular(t.idTratamiento)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TratamientosPage;
