import { useEffect, useState } from "react";
import { SCRIPT_URL, TIPOS, METODOS } from "../../constants";
import { useMontoMask } from "../../hooks/useMontoMask";
import { MontoInput } from "../shared/MontoInput";
import { CategoriaSelect } from "../shared/CategoriaSelect";

export function ModalEditar({ movimiento, categoriasExtra, onGuardado, onCerrar }) {
  const [concepto, setConcepto] = useState("");
  const [tipo, setTipo] = useState("Egreso");
  const [fecha, setFecha] = useState("");
  const [metodo, setMetodo] = useState("Digital");
  const [catSel, setCatSel] = useState("");
  const [catManual, setCatManual] = useState("");
  const [guardando, setGuardando] = useState(false);
  const monto = useMontoMask();

  useEffect(() => {
    if (!movimiento) return;
    setConcepto(movimiento.concepto);
    setTipo(movimiento.tipo);
    setFecha(movimiento.fecha);
    setMetodo(movimiento.metodo || "Digital");
    setCatSel(movimiento.cat);
    setCatManual("");
    monto.setValorExterno(movimiento.monto);
  }, [movimiento]);

  if (!movimiento) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const categoriaFinal = catSel === "OTRA" ? catManual : catSel;
    if (!categoriaFinal) return alert("Selecciona categoría.");
    setGuardando(true);
    try {
      const fd = new FormData();
      fd.append("action", "edit_movimiento");
      fd.append("id", movimiento.id);
      fd.append("hoja", movimiento.hoja);
      fd.append("concepto", concepto.trim() || "-");
      fd.append("monto", monto.valor);
      fd.append("tipo", tipo);
      fd.append("categoria", categoriaFinal);
      fd.append("metodo", metodo);
      fd.append("fecha_manual", new Date(fecha).getTime().toString());
      await fetch(SCRIPT_URL, { method: "POST", body: fd });
      await onGuardado();
      onCerrar();
    } catch {
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5">
        <h6 className="font-extrabold mb-4 text-sm uppercase text-[#5d1029]">Editar Movimiento</h6>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <div className="grid grid-cols-7 gap-2">
            <div className="col-span-4">
              <MontoInput valor={monto.valor} onChange={monto.onChange} />
            </div>
            <div className="col-span-3">
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-pink-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)}
            placeholder="Concepto"
            className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          <CategoriaSelect
            hoja={movimiento.hoja}
            categoriasExtra={categoriasExtra}
            value={catSel}
            onChange={(e) => setCatSel(e.target.value)}
          />
          {catSel === "OTRA" && (
            <input type="text" value={catManual} onChange={(e) => setCatManual(e.target.value)}
              placeholder="Nombre categoría..."
              className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          )}
          <select value={metodo} onChange={(e) => setMetodo(e.target.value)}
            className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
            {METODOS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onCerrar}
              className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2.5 font-semibold text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={guardando}
              className="flex-1 bg-pink-400 text-white rounded-xl py-2.5 font-extrabold text-sm disabled:opacity-60">
              {guardando ? "..." : "ACTUALIZAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
