import type { ElementType } from "react";
import Modal from "./Modal";
import {
  VistaDetallesEntidad,
  type VistaDetallesProps,
} from "./DetallesDatos";

interface Props {
  abierto: boolean;
  id: number | null;
  entity: VistaDetallesProps["entity"];
  configReporte: VistaDetallesProps["configReporte"];
  icono: ElementType;
  subtitulo: string;
  onCerrar: () => void;
}

// Modal "Detalles del Registro" (usado por Dueños, Mascotas, ...)
function ModalDetalles({
  abierto,
  id,
  entity,
  configReporte,
  icono,
  subtitulo,
  onCerrar,
}: Props) {
  return (
    <Modal
      abierto={abierto}
      titulo="Detalles del Registro"
      subtitulo={subtitulo}
      icono={icono}
      onCerrar={onCerrar}
    >
      {id && (
        <VistaDetallesEntidad
          entity={entity}
          id={id}
          configReporte={configReporte}
        />
      )}
    </Modal>
  );
}

export default ModalDetalles;
