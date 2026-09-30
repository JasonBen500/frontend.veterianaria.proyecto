import api from "../api/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>("/usuarios/login", data);
