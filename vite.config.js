import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/finanzas/", // REEMPLAZÁ ESTO POR EL NOMBRE DE TU REPOSITORIO
});
