import { useState } from "react";
import { useMontoMask } from "../../hooks/useMontoMask";
import { MontoInput } from "../shared/MontoInput";
import { parsearMontoAR } from "../../utils";

export function ModalCredito({ visible, onConfirmar, onCancelar }) {
  const [cuotas, setCuotas] = useState(3);
  const montoCuota = useMontoMask();

  function handleConfirmar() {
    const c = parseInt(cuotas, 10);
    if (!c || !montoCuota.valor || montoCuota.valor === "0,00") {
      alert("Completa cuotas y monto.");
      return;
    }
    if (c > 12) {
      alert("El máximo permitido son 12 cuotas.");
      setCuotas(12);
      return;
    }
    const valorLimpio = parsearMontoAR(montoCuota.valor);
    const total = valorLimpio * c;
    onConfirmar({ cuotas: c, montoCuota: montoCuota.valor, total });
    montoCuota.reset();
    setCuotas(3);
  }

  function handleCancelar() {
    montoCuota.reset();
    setCuotas(3);
    onCancelar();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl border-2 border-pink-400 w-full max-w-sm p-5">
        <h6 className="text-pink-400 font-extrabold uppercase text-center mb-4 text-sm">
          Detalles del Crédito
        </h6>

        <label className="text-xs font-bold block mb-1">Cantidad de Cuotas (Máx 12):</label>
        <input
          type="number"
          min={1}
          max={12}
          value={cuotas}
          onChange={(e) => setCuotas(e.target.value)}
          className="w-full border border-pink-200 rounded-xl px-3 py-2 text-center font-bold text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <label className="text-xs font-bold block mb-1">Valor de la Cuota ($):</label>
        <MontoInput
          valor={montoCuota.valor}
          onChange={montoCuota.onChange}
          className="text-center font-bold text-red-600 mb-4"
        />

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleCancelar}
            className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2.5 font-semibold text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="flex-1 bg-pink-400 text-white rounded-xl py-2.5 font-extrabold text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
