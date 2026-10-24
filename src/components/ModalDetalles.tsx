import type { ElementType, ReactNode } from "react";
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
  acciones?: ReactNode;
}

function ModalDetalles({
  abierto,
  id,
  entity,
  configReporte,
  icono,
  subtitulo,
  onCerrar,
  acciones,
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
      
      {id && acciones && (
        <div className="mt-6 flex justify-end border-t border-marca-oscuro/10 pt-4">
          {acciones}
        </div>
      )}
    </Modal>
  );
}

export default ModalDetalles;
