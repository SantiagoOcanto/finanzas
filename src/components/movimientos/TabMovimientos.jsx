import { VistaCompleta } from "./VistaCompleta";

export function TabMovimientos({ db, categoriasExtra, hoja, onEditar, onRecargar }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <VistaCompleta
        db={db}
        categoriasExtra={categoriasExtra}
        hoja={hoja}
        onEditar={onEditar}
        onRecargar={onRecargar}
      />
    </div>
  );
}
