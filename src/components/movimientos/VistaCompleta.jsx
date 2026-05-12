import { useState, useMemo } from "react";
import { CATS_BASE, MESES, SCRIPT_URL } from "../../constants";
import { formatFechaCorta } from "../../utils";

export function VistaCompleta({ db, categoriasExtra, hoja, onEditar, onRecargar }) {
  const mesActual = new Date().getMonth();
  const [mesesSel, setMesesSel] = useState([mesActual]);
  const [filtrosCats, setFiltrosCats] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("carga");
  const [suma, setSuma] = useState(0);
  const [seleccionados, setSeleccionados] = useState({});

  // Todos los movimientos aplanados
  const todos = useMemo(() => {
    const arr = [];
    ["personal", "trabajos"].forEach((h) => {
      (db[h] || []).forEach((m, i) =>
        arr.push({ d: m, id: i + 2, h: h.charAt(0).toUpperCase() + h.slice(1) })
      );
    });
    return arr;
  }, [db]);

  // Categorías disponibles para filtro
  const todasCats = useMemo(
    () => [...new Set([...CATS_BASE[hoja], ...(categoriasExtra[hoja] || [])])],
    [hoja, categoriasExtra]
  );

  // Filtrado y ordenado
  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return todos
      .filter((x) => {
        const f = new Date(x.d[0]);
        const pasaMes = mesesSel.includes(f.getUTCMonth());
        const pasaCat = filtrosCats.length === 0 || filtrosCats.includes(x.d[4]);
        const pasaBus = !q || x.d[1].toLowerCase().includes(q);
        return pasaMes && pasaCat && pasaBus;
      })
      .sort((a, b) =>
        orden === "fecha"
          ? new Date(b.d[0]) - new Date(a.d[0])
          : b.id - a.id
      );
  }, [todos, mesesSel, filtrosCats, busqueda, orden]);

  function toggleMes(i) {
    setMesesSel((prev) =>
      prev.includes(i)
        ? prev.length > 1 ? prev.filter((m) => m !== i) : prev
        : [...prev, i]
    );
  }

  function toggleCat(cat) {
    if (cat === "TODAS") return setFiltrosCats([]);
    setFiltrosCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function getValorMov(x) {
    const ing = parseFloat(x.d[2]) || 0;
    const monto = ing || parseFloat(x.d[3]);
    return ing > 0 ? monto : -monto;
  }

  function toggleCheck(key, valor) {
    setSeleccionados((prev) => {
      const copia = { ...prev };
      if (copia[key]) {
        delete copia[key];
        setSuma((s) => s - valor);
      } else {
        copia[key] = valor;
        setSuma((s) => s + valor);
      }
      return copia;
    });
  }

  function seleccionarTodo() {
    const algunoSinCheck = filtrados.some(
      (x) => !seleccionados[`${x.h}-${x.id}`]
    );
    if (algunoSinCheck) {
      const nuevo = {};
      let s = 0;
      filtrados.forEach((x) => {
        const v = getValorMov(x);
        nuevo[`${x.h}-${x.id}`] = v;
        s += v;
      });
      setSeleccionados(nuevo);
      setSuma(s);
    } else {
      setSeleccionados({});
      setSuma(0);
    }
  }

  async function eliminarMov(h, id) {
    if (confirm("¿Borrar?")) {
      await fetch(`${SCRIPT_URL}?action=delete_movimiento&hoja=${h}&id=${id}`);
      await onRecargar();
    }
  }

  const sumaAbs = Math.abs(suma);
  const mostrarSuma = sumaAbs >= 0.01;

  return (
    <>
      {/* Float suma */}
      {mostrarSuma && (
        <div className="fixed bottom-24 right-5 bg-pink-400 text-white px-4 py-2 rounded-full font-bold z-50 text-sm">
          Suma: ${suma.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>
      )}

      <div>
        {/* Header */}
        <div className="mb-3">
          <span className="font-extrabold text-xs tracking-widest uppercase text-[#5d1029]">
            Movimientos
          </span>
        </div>

        {/* Meses */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
          {MESES.map((m, i) => (
            <button key={i} onClick={() => toggleMes(i)}
              className={`rounded-xl px-2.5 py-1 text-[0.65rem] font-bold whitespace-nowrap border transition-colors
                ${mesesSel.includes(i)
                  ? "bg-[#5d1029] text-white border-[#5d1029]"
                  : "bg-white border-gray-200 text-[#5d1029]"}`}>
              {m}
            </button>
          ))}
        </div>

        {/* Búsqueda centrada */}
        <div className="flex justify-center mb-3">
          <div className="relative w-full max-w-[200px]">
            <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-7 pr-3 py-1.5 border border-pink-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
          <button onClick={() => toggleCat("TODAS")}
            className={`rounded-xl px-3 py-1 text-[0.7rem] font-bold whitespace-nowrap border
              ${filtrosCats.length === 0 ? "bg-[#5d1029] text-white border-[#5d1029]" : "bg-white border-gray-200 text-[#5d1029]"}`}>
            Todas
          </button>
          {todasCats.map((c) => (
            <button key={c} onClick={() => toggleCat(c)}
              className={`rounded-xl px-3 py-1 text-[0.7rem] font-bold whitespace-nowrap border
                ${filtrosCats.includes(c) ? "bg-[#5d1029] text-white border-[#5d1029]" : "bg-white border-gray-200 text-[#5d1029]"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Controles orden - alineados a la derecha */}
        <div className="flex justify-end items-center gap-1 mb-3">
          <button onClick={seleccionarTodo}
            className="text-[0.7rem] font-bold px-3 py-1 rounded-xl border-none bg-[#aec6cf] text-[#4a5a61] w-16 text-center">
            Todo
          </button>
          <button onClick={() => setOrden("carga")}
            className={`text-[0.7rem] font-bold px-3 py-1 rounded-xl border text-center w-16
              ${orden === "carga" ? "bg-pink-400 text-white border-pink-400" : "bg-white text-gray-400 border-gray-200"}`}>
            Carga
          </button>
          <button onClick={() => setOrden("fecha")}
            className={`text-[0.7rem] font-bold px-3 py-1 rounded-xl border text-center w-16
              ${orden === "fecha" ? "bg-pink-400 text-white border-pink-400" : "bg-white text-gray-400 border-gray-200"}`}>
            Fecha
          </button>
        </div>

        {/* Lista */}
        <div>
          {filtrados.map((x) => {
            const ing = parseFloat(x.d[2]) || 0;
            const monto = ing || parseFloat(x.d[3]);
            const esIng = ing > 0;
            const key = `${x.h}-${x.id}`;
            const checked = !!seleccionados[key];
            const valor = getValorMov(x);

            return (
              <div key={key}
                onClick={() => toggleCheck(key, valor)}
                className={`flex justify-between items-center rounded-xl border-2 mb-2 px-3 py-2.5 cursor-pointer transition-colors
                  ${checked ? "border-pink-400 bg-pink-50" : "border-gray-100 bg-white"}`}>
                <div className="flex items-center gap-2">
                  <input type="checkbox" readOnly checked={checked}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleCheck(key, valor)}
                    className="accent-pink-400 cursor-pointer" />
                  <div>
                    <div className="text-sm font-bold">
                      {x.d[1]}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        ({formatFechaCorta(x.d[0])})
                      </span>
                    </div>
                    <div className="text-[0.6rem] text-gray-400">{x.h} | {x.d[4]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${esIng ? "text-green-800" : "text-red-800"}`}>
                    {esIng ? "+" : "-"}${monto.toLocaleString("es-AR")}
                  </div>
                  <div className="flex gap-2 mt-1 justify-end" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEditar({
                      id: x.id, hoja: x.h,
                      concepto: x.d[1], monto,
                      tipo: esIng ? "Ingreso" : "Egreso",
                      cat: x.d[4], metodo: x.d[5], fecha: x.d[6],
                    })}>
                      <i className="bi bi-pencil-square text-gray-400 text-sm" />
                    </button>
                    <button onClick={() => eliminarMov(x.h, x.id)}>
                      <i className="bi bi-trash3 text-red-400 text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
