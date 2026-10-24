import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { obtenerMensajeError } from "../utils/errores";

export interface ConfigCrud<T> {
  listar: () => Promise<{ data: T[] }>;
  agregar: (item: T) => Promise<unknown>;
  modificar: (id: number, item: T) => Promise<unknown>;
  anular: (id: number) => Promise<unknown>;
  vacio: T; // formulario en blanco
  obtenerId: (item: T) => number | null;
  camposNumericos?: string[]; // campos del formulario que se guardan como número
  textos: {
    creado: string;
    actualizado: string;
    anulado: string;
    confirmarAnular: string;
    errorListar: string;
  };
}

// Lógica común de las páginas con listado + modal de crear/editar + anular.
// IMPORTANTE: el objeto "config" debe declararse FUERA del componente (valor constante).
export function useCrud<T extends object>(config: ConfigCrud<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<T>(config.vacio);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const recargar = useCallback(async () => {
    try {
      const respuesta = await config.listar();
      setItems(respuesta.data);
    } catch (error) {
      console.error(config.textos.errorListar, error);
      setMensaje(`${config.textos.errorListar}: ${obtenerMensajeError(error)}`);
    }
  }, [config]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const esNumerico = config.camposNumericos?.includes(name) ?? false;
    setForm((prev) => ({ ...prev, [name]: esNumerico ? Number(value) : value }));
  };

  const abrirNuevo = () => {
    setForm(config.vacio);
    setModoEdicion(false);
    setMensaje("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(config.vacio);
    setModoEdicion(false);
    setMensaje("");
  };

  const handleModificar = (item: T) => {
    setForm(item);
    setModoEdicion(true);
    setMensaje("");
    setModalAbierto(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = config.obtenerId(form);
    try {
      if (modoEdicion && id !== null) {
        await config.modificar(id, form);
        setMensaje(config.textos.actualizado);
      } else {
        await config.agregar(form);
        setMensaje(config.textos.creado);
      }
      setModalAbierto(false);
      setForm(config.vacio);
      setModoEdicion(false);
      recargar();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  const handleAnular = async (id: number) => {
    if (!window.confirm(config.textos.confirmarAnular)) return;
    try {
      await config.anular(id);
      setMensaje(config.textos.anulado);
      recargar();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
    }
  };

  return {
    items,
    form,
    setForm,
    modoEdicion,
    modalAbierto,
    mensaje,
    setMensaje,
    recargar,
    handleChange,
    abrirNuevo,
    cerrarModal,
    handleModificar,
    handleSubmit,
    handleAnular,
  };
}
