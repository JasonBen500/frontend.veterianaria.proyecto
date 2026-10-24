import { useState } from "react";
import { Pill, Package } from "lucide-react";
import {
  listarMedicamentosActivos,
  agregarMedicamento,
  modificarMedicamento,
  anularMedicamento,
  eliminarMedicamento,
  ajustarStockMedicamento,
} from "../services/medicamentosService";
import type { Medicamentos } from "../types/medicamentos";
import Mensaje from "../components/Mensaje";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import FiltrosTabla from "../components/FiltrosTabla";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import { CLASE_INPUT } from "../components/formulario/estilosFormulario";
import TarjetaMedicamento from "../components/medicamentos/TarjetaMedicamento";
import CampoImagen from "../components/medicamentos/CampoImagen";
import { useAuth } from "../context/AuthContext";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useFiltros } from "../hooks/useFiltros";
import { reporteMedicamentos } from "../utils/reportes";
import { obtenerMensajeError } from "../utils/errores";
import { filtrarPorTexto } from "../utils/busqueda";

const configMedicamentos: ConfigCrud<Medicamentos> = {
  listar: listarMedicamentosActivos,
  agregar: agregarMedicamento,
  modificar: modificarMedicamento,
  anular: anularMedicamento,
  obtenerId: (m) => m.idMedicamento,
  camposNumericos: ["precio", "stock"],
  vacio: {
    idMedicamento: null,
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    estado: true,
  },
  textos: {
    creado: "Medicamento creado correctamente",
    actualizado: "Medicamento actualizado correctamente",
    anulado: "Medicamento anulado correctamente",
    confirmarAnular: "¿Seguro que deseas anular este medicamento?",
    errorListar: "Error al listar medicamentos",
  },
};

function MedicamentosPage() {
  const { esAdmin } = useAuth();
  const crud = useCrud(configMedicamentos);
  const [busqueda, setBusqueda] = useState("");
  const filtros = useFiltros(crud.items, [
    {
      tipo: "select",
      id: "disponibilidad",
      etiqueta: "Disponibilidad",
      opciones: ["Disponible", "Stock bajo", "Agotado"],
      valor: (m) =>
        m.stock <= 0 ? "Agotado" : m.stock <= 10 ? "Stock bajo" : "Disponible",
    },
    { tipo: "numero", id: "stock", etiqueta: "Stock (unidades)", valor: (m) => m.stock },
    { tipo: "numero", id: "precio", etiqueta: "Precio (Q)", valor: (m) => m.precio },
  ]);
  const visibles = filtrarPorTexto(filtros.filtrados, busqueda);

  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este medicamento? Esta acción no se puede deshacer.",
      )
    )
      return;
    try {
      await eliminarMedicamento(id);
      crud.setMensaje("Medicamento eliminado correctamente");
      crud.recargar();
    } catch (error) {
      crud.setMensaje(obtenerMensajeError(error));
    }
  };

  const handleAjustarStock = async (id: number, cambio: number) => {
    try {
      await ajustarStockMedicamento(id, cambio);
      crud.recargar();
    } catch (error) {
      crud.setMensaje(obtenerMensajeError(error));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Inventario de Medicamentos"
        ruta="/medicamentos"
        icono={Pill}
      />

      <BarraListado
        titulo="Medicamentos"
        exportar={<BotonesExportar {...reporteMedicamentos} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre o descripción..."
        textoBoton="Nuevo Medicamento"
        onNuevo={crud.abrirNuevo}
      />

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      {visibles.length === 0 ? (
        <p className="font-nunito text-sm font-semibold text-marca-oscuro/60 text-center mt-8">
          No hay medicamentos para mostrar.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map((m) => (
            <TarjetaMedicamento
              key={m.idMedicamento}
              medicamento={m}
              onEditar={() => crud.handleModificar(m)}
              onAnular={() =>
                m.idMedicamento !== null && crud.handleAnular(m.idMedicamento)
              }
              onEliminar={
                esAdmin
                  ? () => m.idMedicamento !== null && handleEliminar(m.idMedicamento)
                  : undefined
              }
              onAjustarStock={(cambio) =>
                m.idMedicamento !== null
                  ? handleAjustarStock(m.idMedicamento, cambio)
                  : Promise.resolve()
              }
            />
          ))}
        </div>
      )}

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR MEDICAMENTO" : "NUEVO MEDICAMENTO"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información del medicamento:"
            : "Ingresa los datos del nuevo medicamento:"
        }
        icono={Pill}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:" icono={Pill}>
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Paracetamol"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Descripción:">
          <input
            name="descripcion"
            value={crud.form.descripcion}
            onChange={crud.handleChange}
            placeholder="Ej. Analgésico y antipirético"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Precio:">
          <input
            type="number"
            name="precio"
            value={crud.form.precio}
            onChange={crud.handleChange}
            min={0}
            step="0.01"
            placeholder="0.00"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Stock:" icono={Package}>
          <input
            type="number"
            name="stock"
            value={crud.form.stock}
            onChange={crud.handleChange}
            min={0}
            placeholder="Ej. 50"
            className={CLASE_INPUT}
          />
        </Campo>

        <CampoImagen
          imagen={crud.form.imagen}
          onCambiar={(imagen) => crud.setForm((prev) => ({ ...prev, imagen }))}
          onError={crud.setMensaje}
        />
      </ModalFormulario>
    </div>
  );
}

export default MedicamentosPage;
