import { Link } from "react-router-dom";

function NoEncontradoPage() {
  return (
    <div className="mx-auto mt-16 max-w-md p-6 text-center">
      <h1 className="font-nunito text-5xl font-extrabold text-marca-oscuro">404</h1>
      <p className="mt-2 font-nunito text-marca-oscuro/70">
        La página que buscas no existe.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-marca-naranja px-6 py-2 font-nunito font-bold text-marca-oscuro transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NoEncontradoPage;
