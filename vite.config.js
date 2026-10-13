import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/rental-property-management/",
  build: { sourcemap: false },
  plugins: [react()],
});
