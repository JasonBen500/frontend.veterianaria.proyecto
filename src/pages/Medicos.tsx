import { useState } from "react";
import { Stethoscope } from "lucide-react";
import {
  listarMedicosActivos,
  agregarMedico,
  modificarMedico,
  anularMedico,
} from "../services/medicoService";
import { listarUsuariosActivos } from "../services/usuariosService";
import type { Medico } from "../types/medico";
import Mensaje from "../components/Mensaje";
import AccionesFila from "../components/AccionesFilas";
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
import { reporteMedicos } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";

const configMedicos: ConfigCrud<Medico> = {
  listar: listarMedicosActivos,
  agregar: agregarMedico,
  modificar: modificarMedico,
  anular: anularMedico,
  obtenerId: (m) => m.idMedico,
  camposNumericos: ["idUsuario"],
  vacio: {
    idMedico: null,
    nombre: "",
    apellido: "",
    cedula: "",
    especialidad: "",
    estado: true,
    idUsuario: 0,
  },
  textos: {
    creado: "Médico creado correctamente",
    actualizado: "Médico actualizado correctamente",
    anulado: "Médico anulado correctamente",
    confirmarAnular: "¿Seguro que deseas anular este médico?",
    errorListar: "Error al listar médicos",
  },
};

function MedicosPage() {
  const crud = useCrud(configMedicos);
  const usuarios = useLista(listarUsuariosActivos);
  const [busqueda, setBusqueda] = useState("");

  const medicosFiltrados = filtrarPorTexto(crud.items, busqueda);

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Médicos"
        ruta="/medicos"
        padres={[{ texto: "Administración", ruta: "/administracion" }]}
      />

      <BarraListado
        titulo="Listado de Médicos"
        exportar={<BotonesExportar {...reporteMedicos} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, cédula o especialidad..."
        textoBoton="Nuevo Médico"
        onNuevo={crud.abrirNuevo}
      />

      <Mensaje texto={crud.mensaje} />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR MÉDICO" : "NUEVO MÉDICO"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información del médico:"
            : "Ingresa los datos del nuevo médico:"
        }
        icono={Stethoscope}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:">
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Carlos"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Apellido:">
          <input
            name="apellido"
            value={crud.form.apellido}
            onChange={crud.handleChange}
            placeholder="Ej. Mendoza"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Cédula:">
          <input
            name="cedula"
            value={crud.form.cedula}
            onChange={crud.handleChange}
            placeholder="Ej. 0912345678"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Especialidad:">
          <input
            name="especialidad"
            value={crud.form.especialidad}
            onChange={crud.handleChange}
            placeholder="Ej. Cirugía Veterinaria"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Usuario:" className="md:col-span-2">
          <select
            name="idUsuario"
            value={crud.form.idUsuario === 0 ? "" : crud.form.idUsuario}
            onChange={crud.handleChange}
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un usuario
            </option>
            {usuarios.map((u) => (
              <option
                key={u.idUsuario}
                value={u.idUsuario ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {u.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </ModalFormulario>

      {medicosFiltrados.length === 0 ? (
        <p className="font-nunito text-sm font-semibold text-marca-oscuro/60 text-center mt-8">
          No hay médicos para mostrar.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicosFiltrados.map((m) => (
            <div
              key={m.idMedico}
              className="bg-marca-verdesemiclaro border border-marca-naranja rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-marca-beigeclaro2 border border-marca-oscuro/20 flex items-center justify-center text-marca-oscuro shrink-0 shadow-inner">
                  <Stethoscope size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-nunito font-extrabold text-lg text-gray-800 truncate">
                    {m.nombre} {m.apellido}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium truncate">
                    Cédula: {m.cedula}
                  </p>
                  <p className="text-xs text-marca-oscuro/80 font-bold mt-1 truncate">
                    {m.especialidad}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-marca-oscuro/40 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-marca-beigeclaro2 text-marca-oscuro">
                  Usuario: {m.nombreUsuario ?? "—"}
                </span>
                <div className="flex items-center gap-1">
                  <AccionesFila
                    onEditar={() => crud.handleModificar(m)}
                    onAnular={() =>
                      m.idMedico !== null && crud.handleAnular(m.idMedico)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicosPage;
