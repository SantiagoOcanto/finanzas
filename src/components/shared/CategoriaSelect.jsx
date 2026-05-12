import { CATS_BASE } from "../../constants";

export function CategoriaSelect({ hoja, categoriasExtra, value, onChange, nombre = "cat_select" }) {
  const todas = [...new Set([...CATS_BASE[hoja], ...(categoriasExtra[hoja] || [])])];

  return (
    <select
      name={nombre}
      value={value}
      onChange={onChange}
      className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      required
    >
      <option value="" disabled>Elegir...</option>
      {todas.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
      <option value="OTRA">+ NUEVA</option>
    </select>
  );
}
