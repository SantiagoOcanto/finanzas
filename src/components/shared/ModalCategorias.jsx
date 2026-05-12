export function ModalCategorias({ visible, hoja, categoriasExtra, onEliminar, onCerrar }) {
  if (!visible) return null;

  const extras = categoriasExtra[hoja] || [];

  function handleEliminar(cat) {
    if (confirm(`¿Quitar "${cat}" de los filtros?`)) {
      onEliminar(hoja, cat);
      onCerrar();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5">
        <div className="flex justify-between items-center mb-3">
          <h6 className="font-extrabold text-sm uppercase text-[#5d1029]">Gestionar Categorías</h6>
          <button onClick={onCerrar} className="text-gray-400 text-xl leading-none">&times;</button>
        </div>
        <p className="text-xs text-gray-400 mb-3">Solo categorías manuales sin movimientos asociados.</p>
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
          {extras.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-4">No hay categorías manuales</p>
          ) : (
            extras.map((c) => (
              <div key={c} className="flex justify-between items-center py-2">
                <span className="text-sm">{c}</span>
                <button onClick={() => handleEliminar(c)}
                  className="text-red-400 hover:text-red-600 text-sm">
                  <i className="bi bi-trash3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
