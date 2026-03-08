import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <-- TAMBAHKAN IMPORT INI
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), // <-- TAMBAHKAN PLUGIN REACT
    tailwindcss(),
  ],
});
