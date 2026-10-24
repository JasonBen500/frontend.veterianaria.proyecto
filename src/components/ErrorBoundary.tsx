import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface Estado {
  fallo: boolean;
}

// Evita que un error de una página deje toda la app en blanco
class ErrorBoundary extends Component<Props, Estado> {
  state: Estado = { fallo: false };

  static getDerivedStateFromError(): Estado {
    return { fallo: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error en la interfaz", error, info.componentStack);
  }

  render() {
    if (!this.state.fallo) return this.props.children;
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-marca-oscuro/10 bg-marca-beigeclaro2 p-8 text-center shadow-sm">
        <h2 className="font-nunito text-2xl font-extrabold text-marca-oscuro">
          Algo salió mal
        </h2>
        <p className="mt-2 font-nunito text-sm text-marca-oscuro/70">
          Ocurrió un error al mostrar esta pantalla. Intenta recargar la página.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
        >
          Recargar
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
