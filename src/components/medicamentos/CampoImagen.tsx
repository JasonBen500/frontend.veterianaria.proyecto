import type { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import Campo from "../formulario/Campo";
import { archivoADataUrl } from "../../utils/imagenes";

interface Props {
  imagen?: string;
  onCambiar: (imagen: string) => void;
  onError: (mensaje: string) => void;
}

// Elegir, cambiar o quitar la imagen de referencia de un medicamento
function CampoImagen({ imagen, onCambiar, onError }: Props) {
  const handleImagen = async (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite elegir el mismo archivo otra vez
    if (!archivo) return;

    try {
      onCambiar(await archivoADataUrl(archivo));
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "No se pudo cargar la imagen",
      );
    }
  };

  return (
    <Campo
      etiqueta="Imagen de referencia:"
      icono={ImagePlus}
      className="col-span-full"
    >
      <div className="flex items-center gap-4">
        {imagen ? (
          <img
            src={imagen}
            alt="Vista previa"
            className="h-24 w-24 rounded-2xl border border-marca-oscuro/10 object-cover shadow-md"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-marca-naranja/25 text-marca-oscuro/40">
            <ImagePlus size={32} />
          </div>
        )}

        <div className="flex flex-col items-start gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-marca-oscuro px-5 py-1.5 font-nunito text-sm font-bold text-marca-oscuro transition hover:bg-marca-oscuro hover:text-white">
            <ImagePlus size={16} />
            {imagen ? "Cambiar imagen" : "Elegir imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImagen}
              className="hidden"
            />
          </label>

          {imagen && (
            <button
              type="button"
              onClick={() => onCambiar("")}
              className="font-nunito text-sm font-semibold text-marca-vino hover:underline"
            >
              Quitar imagen
            </button>
          )}
        </div>
      </div>
    </Campo>
  );
}

export default CampoImagen;
