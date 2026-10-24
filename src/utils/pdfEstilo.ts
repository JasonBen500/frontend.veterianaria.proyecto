import type { jsPDF as DocumentoPdf } from "jspdf";
import logoUrl from "../assets/images/LogoAzul.png";

export type Color = [number, number, number];

export const EMPRESA = "Firolaiv Veterinaria";
export const ESLOGAN = "Sus patas en buenas manos";

// Colores de la web (index.css)
export const OSCURO: Color = [42, 47, 99]; // marca-oscuro
export const NARANJA: Color = [255, 179, 80]; // marca-naranja
export const CORAL: Color = [255, 106, 90]; // marca-coral
export const VERDE: Color = [131, 184, 170]; // marca-verde
export const BEIGE: Color = [243, 242, 227]; // marca-beigeclaro2
export const BEIGE_CALIDO: Color = [243, 219, 195]; // marca-beigeclaro
export const GRIS: Color = [102, 102, 102]; // marca-grisclaro
// Versiones suaves para los adornos (sin usar transparencia)
export const NARANJA_SUAVE: Color = [255, 228, 190];
export const AZUL_SUAVE: Color = [196, 222, 244];
export const VERDE_SUAVE: Color = [214, 233, 228];

export const MARGEN = 14;
export const ALTO_PIE = 16;

// Huella de mascota: x,y = centro; tam = ancho aproximado en mm
export function huella(
    doc: DocumentoPdf,
    x: number,
    y: number,
    tam: number,
    color: Color,
) {
    const u = tam / 10;
    doc.setFillColor(...color);
    doc.ellipse(x, y + 2.2 * u, 3.2 * u, 2.6 * u, "F");
    doc.circle(x - 3.6 * u, y - 1.6 * u, 1.25 * u, "F");
    doc.circle(x - 1.3 * u, y - 3.6 * u, 1.35 * u, "F");
    doc.circle(x + 1.3 * u, y - 3.6 * u, 1.35 * u, "F");
    doc.circle(x + 3.6 * u, y - 1.6 * u, 1.25 * u, "F");
}

// Hueso: x = inicio, y = centro vertical
export function hueso(
    doc: DocumentoPdf,
    x: number,
    y: number,
    largo: number,
    color: Color,
) {
    const r = largo * 0.09;
    const barra = r * 1.3;
    doc.setFillColor(...color);
    doc.rect(x + r, y - barra / 2, largo - 2 * r, barra, "F");
    doc.circle(x + r, y - r * 0.7, r, "F");
    doc.circle(x + r, y + r * 0.7, r, "F");
    doc.circle(x + largo - r, y - r * 0.7, r, "F");
    doc.circle(x + largo - r, y + r * 0.7, r, "F");
}

// Carga el logo y lo reduce para que el PDF no pese de más
export async function cargarLogo(): Promise<{
    data: string;
    proporcion: number;
} | null> {
    try {
        const img = new Image();
        img.src = logoUrl;
        await img.decode();
        const ancho = 500;
        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = Math.round((img.naturalHeight / img.naturalWidth) * ancho);
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return {
            data: canvas.toDataURL("image/png"),
            proporcion: canvas.height / canvas.width,
        };
    } catch {
        return null;
    }
}

// Pie de página en todas las hojas: se llama una sola vez, al final
export function dibujarPie(doc: DocumentoPdf) {
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();
    const paginas = doc.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {
        doc.setPage(i);
        doc.setFillColor(...BEIGE);
        doc.rect(0, alto - ALTO_PIE, ancho, ALTO_PIE, "F");
        doc.setFillColor(...NARANJA);
        doc.rect(0, alto - ALTO_PIE, ancho, 1.2, "F");

        huella(doc, MARGEN + 3, alto - 7.5, 6, NARANJA_SUAVE);
        hueso(doc, MARGEN + 11, alto - 6.5, 9, AZUL_SUAVE);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...GRIS);
        doc.text(`${EMPRESA} · ${ESLOGAN}`, ancho / 2, alto - 6, {
            align: "center",
        });
        doc.text(`Página ${i} de ${paginas}`, ancho - MARGEN, alto - 6, {
            align: "right",
        });
    }
}