import { useState, useCallback } from "react";
import { SCRIPT_URL, CATS_BASE } from "../constants";

const INITIAL_DB = { personal: [], trabajos: [] };
const INITIAL_EXTRAS = { Personal: [], Trabajos: [] };

export function useDB() {
  const [db, setDb] = useState(INITIAL_DB);
  const [categoriasExtra, setCategoriasExtra] = useState(INITIAL_EXTRAS);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await fetch(`${SCRIPT_URL}?t=${Date.now()}`);
      const data = await r.json();
      setDb(data);

      // Reconstruir categorías extra desde los datos
      const extras = { Personal: [], Trabajos: [] };
      ["personal", "trabajos"].forEach((k) => {
        const hN = k === "personal" ? "Personal" : "Trabajos";
        (data[k] || []).forEach((m) => {
          if (m[4] && !CATS_BASE[hN].includes(m[4]) && !extras[hN].includes(m[4])) {
            extras[hN].push(m[4]);
          }
        });
      });
      setCategoriasExtra(extras);
    } finally {
      setCargando(false);
    }
  }, []);

  const eliminarCategoriaExtra = useCallback((hoja, cat) => {
    setCategoriasExtra((prev) => ({
      ...prev,
      [hoja]: prev[hoja].filter((c) => c !== cat),
    }));
  }, []);

  return { db, categoriasExtra, cargando, cargar, eliminarCategoriaExtra };
}
