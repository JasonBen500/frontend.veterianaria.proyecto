import { UserCog, Lock, ShieldCheck } from "lucide-react";
import {
  listarUsuariosActivos,
  agregarUsuario,
  modificarUsuario,
  anularUsuario,
} from "../services/usuariosService";
import { listarPerfilesActivos } from "../services/perfilService";
import type { Usuarios } from "../types/usuarios";
import Mensaje from "../components/Mensaje";
import BotonesExportar from "../components/BotonesExportar";
import EncabezadoPagina from "../components/EncabezadoPagina";
import BarraListado from "../components/BarraListado";
import FiltrosTabla from "../components/FiltrosTabla";
import ModalFormulario from "../components/formulario/ModalFormulario";
import Campo from "../components/formulario/Campo";
import {
  CLASE_INPUT,
  CLASE_SELECT,
} from "../components/formulario/estilosFormulario";
import TarjetaUsuario from "../components/usuarios/TarjetaUsuario";
import { useState } from "react";
import { useCrud, type ConfigCrud } from "../hooks/useCrud";
import { useLista } from "../hooks/useLista";
import { useFiltros } from "../hooks/useFiltros";
import { reporteUsuarios } from "../utils/reportes";
import { filtrarPorTexto } from "../utils/busqueda";

const configUsuarios: ConfigCrud<Usuarios> = {
  listar: listarUsuariosActivos,
  agregar: agregarUsuario,
  modificar: modificarUsuario,
  anular: anularUsuario,
  obtenerId: (u) => u.idUsuario,
  camposNumericos: ["idPerfil"],
  vacio: {
    idUsuario: null,
    nombre: "",
    usuario: "",
    contrasena: "",
    correo: "",
    estado: true,
    idPerfil: 0,
  },
  textos: {
    creado: "Usuario creado correctamente",
    actualizado: "Usuario actualizado correctamente",
    anulado: "Usuario anulado correctamente",
    confirmarAnular: "¿Seguro que deseas anular este usuario?",
    errorListar: "Error al listar usuarios",
  },
};

function UsuariosPage() {
  const crud = useCrud(configUsuarios);
  const perfiles = useLista(listarPerfilesActivos);
  const [busqueda, setBusqueda] = useState("");
  const filtros = useFiltros(crud.items, [
    { tipo: "select", id: "perfil", etiqueta: "Perfil", valor: (u) => u.nombrePerfil },
  ]);
  const visibles = filtrarPorTexto(filtros.filtrados, busqueda);

  return (
    <div className="p-6 max-w-5xl mx-auto mb-4">
      <EncabezadoPagina
        titulo="Usuarios"
        ruta="/usuarios"
        padres={[{ texto: "Administración", ruta: "/administracion" }]}
        icono={UserCog}
      />

      <BarraListado
        titulo="Listado de Usuarios"
        exportar={<BotonesExportar {...reporteUsuarios} datos={crud.items} />}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, usuario, correo o perfil..."
        textoBoton="Nuevo Usuario"
        onNuevo={crud.abrirNuevo}
      />

      <ModalFormulario
        abierto={crud.modalAbierto}
        titulo={crud.modoEdicion ? "MODIFICAR USUARIO" : "NUEVO USUARIO"}
        subtitulo={
          crud.modoEdicion
            ? "Edita la información del usuario:"
            : "Ingresa los datos del nuevo usuario:"
        }
        icono={UserCog}
        mensaje={crud.mensaje}
        onSubmit={crud.handleSubmit}
        onCerrar={crud.cerrarModal}
      >
        <Campo etiqueta="Nombre:">
          <input
            name="nombre"
            value={crud.form.nombre}
            onChange={crud.handleChange}
            placeholder="Ej. Ana Torres"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Usuario:">
          <input
            name="usuario"
            value={crud.form.usuario}
            onChange={crud.handleChange}
            placeholder="Ej. atorres"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Contraseña:" icono={Lock}>
          <input
            type="password"
            name="contrasena"
            value={crud.form.contrasena}
            onChange={crud.handleChange}
            placeholder="••••••••"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Correo:">
          <input
            type="email"
            name="correo"
            value={crud.form.correo}
            onChange={crud.handleChange}
            placeholder="Ej. ana.torres@email.com"
            className={CLASE_INPUT}
          />
        </Campo>
        <Campo etiqueta="Perfil:" icono={ShieldCheck} className="md:col-span-2">
          <select
            name="idPerfil"
            value={crud.form.idPerfil === 0 ? "" : crud.form.idPerfil}
            onChange={crud.handleChange}
            className={CLASE_SELECT}
          >
            <option value="" disabled className="bg-marca-beige-claro">
              Seleccione un perfil de la lista...
            </option>
            {perfiles.map((p) => (
              <option
                key={p.idPerfil}
                value={p.idPerfil ?? undefined}
                className="bg-marca-beigeclaro2"
              >
                {p.nombrePerfil}
              </option>
            ))}
          </select>
        </Campo>
      </ModalFormulario>

      <FiltrosTabla estado={filtros} />

      <Mensaje texto={crud.mensaje} />

      {visibles.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <UserCog size={40} className="text-marca-verde" />
          <p className="font-nunito text-sm font-bold text-marca-oscuro/60">
            No hay usuarios para mostrar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibles.map((u) => (
            <TarjetaUsuario
              key={u.idUsuario}
              usuario={u}
              onEditar={() => crud.handleModificar(u)}
              onAnular={() =>
                u.idUsuario !== null && crud.handleAnular(u.idUsuario)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;
