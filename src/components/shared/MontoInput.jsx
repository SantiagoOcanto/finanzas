export function MontoInput({ valor, onChange, placeholder = "0,00", className = "", id, name = "monto" }) {
  return (
    <input
      type="text"
      id={id}
      name={name}
      inputMode="numeric"
      value={valor}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={`w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${className}`}
    />
  );
}
