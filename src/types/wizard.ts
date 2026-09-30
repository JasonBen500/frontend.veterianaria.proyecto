import type { Dueno } from "../types/dueno";
import type { Mascota } from "../types/mascota";
import type { Cita } from "../types/cita";

export interface WizardState {
  paso: 1 | 2 | 3;

  //PASO 1
  dueno: Dueno;
  duenoEsNuevo: boolean; // true = se va a crear, false = ya existía (tiene idDueno real)

  //PASO 2
  mascota: Mascota;
  mascotaEsNueva: boolean;

  //PASO 3 OPCIONAL
  quiereAgendarCita: boolean;
  cita: Cita;
}