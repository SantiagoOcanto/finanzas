import { useState, useEffect } from "react";
import { useDB } from "./hooks/useDB";
import { TabNuevo } from "./components/nuevo/TabNuevo";
import { TabMovimientos } from "./components/movimientos/TabMovimientos";
import { ModalEditar } from "./components/shared/ModalEditar";
import { ModalCategorias } from "./components/shared/ModalCategorias";

export default function App() {
  const [tab, setTab] = useState(1);
  const [hoja, setHoja] = useState("Personal");
  const [movEditar, setMovEditar] = useState(null);
  const [modalCatsVisible, setModalCatsVisible] = useState(false);
  const { db, categoriasExtra, cargar, eliminarCategoriaExtra } = useDB();

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff5f7] text-[#5d1029] font-sans pb-28">

      {/* Modales */}
      <ModalEditar
        movimiento={movEditar}
        categoriasExtra={categoriasExtra}
        onGuardado={cargar}
        onCerrar={() => setMovEditar(null)}
      />
      <ModalCategorias
        visible={modalCatsVisible}
        hoja={hoja}
        categoriasExtra={categoriasExtra}
        onEliminar={eliminarCategoriaExtra}
        onCerrar={() => setModalCatsVisible(false)}
      />

      {/* Tab nav */}
      <div className="flex bg-white rounded-2xl overflow-hidden mx-4 mt-4 mb-4 shadow-sm">
        {[{ id: 1, label: "NUEVO" }, { id: 4, label: "MOVIMIENTOS" }].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 font-extrabold text-sm transition-colors
              ${tab === id
                ? "text-pink-400 border-b-[3px] border-pink-400"
                : "text-[#bfa5ae] border-b-[3px] border-transparent"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="px-4">
        {tab === 1 && (
          <TabNuevo
            categoriasExtra={categoriasExtra}
            hoja={hoja}
            onHojaChange={setHoja}
            onGuardado={cargar}
          />
        )}
        {tab === 4 && (
          <TabMovimientos
            db={db}
            categoriasExtra={categoriasExtra}
            hoja={hoja}
            onEditar={setMovEditar}
            onRecargar={cargar}
          />
        )}
      </div>

      {/* Botón de ajustes — solo en tab movimientos */}
      {tab === 4 && (
        <button
          onClick={() => setModalCatsVisible(true)}
          className="fixed bottom-24 right-5 w-11 h-11 rounded-full bg-white text-pink-400 border border-pink-100 shadow-md flex items-center justify-center z-40">
          <i className="bi bi-gear-fill text-base" />
        </button>
      )}
    </div>
  );
}
