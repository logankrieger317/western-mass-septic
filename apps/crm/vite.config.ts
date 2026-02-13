import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "../../config"),
    },
  },
  server: {
    port: 5174,
    proxy: { "/api": "http://localhost:3001" },
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5174,
  },
});
