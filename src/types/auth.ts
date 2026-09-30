export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  usuario: string;
  correo: string;
  idPerfil: number;
  nombrePerfil: string;
  token: string;
}
