const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Lee una imagen, la reduce a un máximo de "maxLado" píxeles y devuelve
// un texto (data URL) listo para guardar en la base de datos
export function archivoADataUrl(
    archivo: File,
    maxLado = 480,
    calidad = 0.8,
): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!archivo.type.startsWith("image/")) {
            reject(new Error("El archivo elegido no es una imagen."));
            return;
        }
        if (archivo.size > MAX_BYTES) {
            reject(new Error("La imagen pesa más de 5 MB. Elige una más pequeña."));
            return;
        }

        const lector = new FileReader();
        lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
        lector.onload = () => {
            const imagen = new Image();
            imagen.onerror = () => reject(new Error("No se pudo abrir la imagen."));
            imagen.onload = () => {
                const escala = Math.min(
                    1,
                    maxLado / Math.max(imagen.width, imagen.height),
                );
                const ancho = Math.round(imagen.width * escala);
                const alto = Math.round(imagen.height * escala);

                const lienzo = document.createElement("canvas");
                lienzo.width = ancho;
                lienzo.height = alto;
                const contexto = lienzo.getContext("2d");
                if (!contexto) {
                    reject(new Error("No se pudo procesar la imagen."));
                    return;
                }

                // Fondo blanco: los PNG con transparencia se verían negros en JPEG
                contexto.fillStyle = "#ffffff";
                contexto.fillRect(0, 0, ancho, alto);
                contexto.drawImage(imagen, 0, 0, ancho, alto);

                resolve(lienzo.toDataURL("image/jpeg", calidad));
            };
            imagen.src = lector.result as string;
        };
        lector.readAsDataURL(archivo);
    });
}