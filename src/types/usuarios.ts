export interface Usuarios {
  idUsuario: number | null;
  nombre: string;
  usuario: string;
  contrasena: string;
  correo: string;
  estado: boolean;
  idPerfil: number;
}