import { useState, useEffect } from "react";

export function useDebounce<T>(valor: T, delayMs: number): T {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDebounced(valor);
    }, delayMs);

    // Si valor cambia antes de que termine el tiempo, cancela el temporizador anterior
    return () => clearTimeout(temporizador);
  }, [valor, delayMs]);

  return valorDebounced;
}
//Funcion para optimizar el sistema y que no sugiera por cada tecla presionada sino por temporizador