export interface Historial {
    idHistorial: number;
    fecha: string;
    usuario: string | null;
    accion: string;
    entidad: string;
    descripcion: string;
}