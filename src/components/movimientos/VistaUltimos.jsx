import { formatFechaCorta } from "../../utils";

export function VistaUltimos({ db, onVerTodos }) {
  const todos = [];
  ["personal", "trabajos"].forEach((h) => {
    (db[h] || []).forEach((m, i) =>
      todos.push({ d: m, id: i + 2, h: h.charAt(0).toUpperCase() + h.slice(1) })
    );
  });
  todos.sort((a, b) => b.id - a.id);
  const ultimos = todos.slice(0, 10);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-extrabold text-xs tracking-widest uppercase text-[#5d1029]">
          Últimos movimientos
        </span>
        <button onClick={onVerTodos}
          className="border border-pink-400 text-pink-400 rounded-full px-3 py-1 text-[0.65rem] font-extrabold">
          Ver todos →
        </button>
      </div>

      {ultimos.length === 0 ? (
        <p className="text-center text-xs text-gray-300 py-3">Sin movimientos</p>
      ) : (
        <div>
          {ultimos.map((x, idx) => {
            const ing = parseFloat(x.d[2]) || 0;
            const monto = ing || parseFloat(x.d[3]);
            const esIng = ing > 0;
            return (
              <div key={idx}
                className={`flex justify-between items-center py-2.5 gap-2 ${idx < ultimos.length - 1 ? "border-b border-pink-50" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[0.8rem] truncate max-w-[60%]">{x.d[1]}</div>
                  <div className="text-[0.6rem] text-[#b89aab] font-semibold">
                    {formatFechaCorta(x.d[0])} · {x.h} · {x.d[4]}
                  </div>
                </div>
                <div className={`font-extrabold text-[0.8rem] whitespace-nowrap ${esIng ? "text-green-800" : "text-red-800"}`}>
                  {esIng ? "+" : "-"}${monto.toLocaleString("es-AR")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
