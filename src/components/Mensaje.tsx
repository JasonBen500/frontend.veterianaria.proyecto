function Mensaje({ texto }: { texto: string }) {
  if (!texto) return null;
  const esError = /error|Error/.test(texto);
  return (
    <p
      className={`mb-4 p-3 rounded border text-sm ${
        esError
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-green-50 text-green-700 border-green-200"
      }`}
    >
      {texto}
    </p>
  );
}

export default Mensaje;
