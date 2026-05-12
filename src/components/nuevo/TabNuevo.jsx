import { useState, useEffect } from "react";
import { SCRIPT_URL, TIPOS, METODOS, HOJAS } from "../../constants";
import { useMontoMask } from "../../hooks/useMontoMask";
import { MontoInput } from "../shared/MontoInput";
import { CategoriaSelect } from "../shared/CategoriaSelect";
import { ModalCredito } from "../shared/ModalCredito";
import { obtenerFechaHoraActual, formatMontoAR, parsearMontoAR } from "../../utils";

export function TabNuevo({ categoriasExtra, hoja, onHojaChange, onGuardado }) {
  const [tipo, setTipo] = useState("Egreso");
  const [fecha, setFecha] = useState(obtenerFechaHoraActual);
  const [concepto, setConcepto] = useState("");
  const [catSel, setCatSel] = useState("");
  const [catManual, setCatManual] = useState("");
  const [metodo, setMetodo] = useState("Digital");
  const [guardando, setGuardando] = useState(false);

  // Crédito
  const [modalCredVisible, setModalCredVisible] = useState(false);
  const [creditoData, setCreditoData] = useState({ cuotas: 1, montoCuota: "0", total: 0 });

  const monto = useMontoMask();

  // Refresca fecha al montar
  useEffect(() => {
    setFecha(obtenerFechaHoraActual());
  }, []);

  function handleMetodoChange(e) {
    const val = e.target.value;
    setMetodo(val);
    if (val === "Crédito") {
      setModalCredVisible(true);
    } else {
      setCreditoData({ cuotas: 1, montoCuota: "0", total: 0 });
    }
  }

  function handleConfirmarCredito({ cuotas, montoCuota, total }) {
    setCreditoData({ cuotas, montoCuota, total });
    monto.setValorExterno(total);
    setModalCredVisible(false);
  }

  function handleCancelarCredito() {
    setMetodo("Digital");
    setCreditoData({ cuotas: 1, montoCuota: "0", total: 0 });
    setModalCredVisible(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const categoriaFinal = catSel === "OTRA" ? catManual : catSel;
    if (!categoriaFinal) return alert("Selecciona categoría.");
    setGuardando(true);
    try {
      const fd = new FormData();
      fd.append("action", "add_movimiento");
      fd.append("monto", monto.valor);
      fd.append("tipo", tipo);
      fd.append("fecha_manual", new Date(fecha).getTime().toString());
      fd.append("concepto", concepto.trim() || "-");
      fd.append("categoria", categoriaFinal);
      fd.append("hoja", hoja);
      fd.append("metodo", metodo);
      if (metodo === "Crédito") {
        fd.append("cuotas", creditoData.cuotas);
        fd.append("monto_cuota", creditoData.montoCuota);
      } else {
        fd.append("cuotas", "1");
        fd.append("monto_cuota", monto.valor);
      }
      await fetch(SCRIPT_URL, { method: "POST", body: fd });
      // Reset form
      monto.reset();
      setTipo("Egreso");
      setFecha(obtenerFechaHoraActual());
      setConcepto("");
      setCatSel("");
      setCatManual("");
      setMetodo("Digital");
      setCreditoData({ cuotas: 1, montoCuota: "0", total: 0 });
      await onGuardado();
    } catch {
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <ModalCredito
        visible={modalCredVisible}
        onConfirmar={handleConfirmarCredito}
        onCancelar={handleCancelarCredito}
      />

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* Monto + Tipo */}
          <div className="grid grid-cols-7 gap-2">
            <div className="col-span-4">
              <label className="text-xs font-bold block mb-1">Monto Total ($):</label>
              <MontoInput valor={monto.valor} onChange={monto.onChange} />
            </div>
            <div className="col-span-3">
              <label className="text-xs font-bold block mb-1">Tipo:</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-pink-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-xs font-bold block mb-1">Fecha y Hora:</label>
            <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          {/* Concepto */}
          <div>
            <label className="text-xs font-bold block mb-1">¿Qué es?:</label>
            <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Alquiler"
              className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-bold block mb-1">Categoría:</label>
            <CategoriaSelect
              hoja={hoja}
              categoriasExtra={categoriasExtra}
              value={catSel}
              onChange={(e) => setCatSel(e.target.value)}
            />
            {catSel === "OTRA" && (
              <input type="text" value={catManual} onChange={(e) => setCatManual(e.target.value)}
                placeholder="Nombre categoría..."
                className="w-full border border-pink-200 rounded-xl px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
            )}
          </div>

          {/* Hoja + Método */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold block mb-1">Hoja:</label>
              <select value={hoja} onChange={(e) => onHojaChange(e.target.value)}
                className="w-full border border-pink-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                {HOJAS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Método:</label>
              <select value={metodo} onChange={handleMetodoChange}
                className="w-full border border-pink-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option value="Digital">Digital</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Crédito">Crédito 💳</option>
              </select>
            </div>
          </div>

          {/* Botón fijo al fondo */}
          <div className="fixed bottom-0 left-0 w-full px-4 py-4 bg-[#fff5f7] shadow-[0_-10px_20px_rgba(255,245,247,0.9)] z-40">
            <button type="submit" disabled={guardando}
              className="w-full bg-pink-400 text-white rounded-2xl py-3.5 font-extrabold text-sm disabled:opacity-60">
              {guardando ? "..." : "GUARDAR REGISTRO"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
