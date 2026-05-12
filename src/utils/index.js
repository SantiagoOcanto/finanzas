/** Devuelve el valor datetime-local en hora local, sin desfase UTC */
export function obtenerFechaHoraActual() {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  return ahora.toISOString().slice(0, 16);
}

/** Formatea un número como 1.234,56 (es-AR) */
export function formatMontoAR(valor) {
  return valor
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Aplica la máscara de monto mientras el usuario tipea */
export function aplicarMascaraMonto(raw) {
  const digits = raw.replace(/\D/g, "");
  const numero = (parseInt(digits || "0", 10) / 100).toFixed(2);
  const [entero, dec] = numero.split(".");
  const enteroFormato = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${enteroFormato},${dec}`;
}

/** Parsea un monto formateado AR → float */
export function parsearMontoAR(str) {
  return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
}

/** Formatea fecha UTC para mostrar (DD/MM) sin desfase */
export function formatFechaCorta(fechaRaw) {
  const f = new Date(fechaRaw);
  const d = f.getUTCDate().toString().padStart(2, "0");
  const m = (f.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${d}/${m}`;
}
