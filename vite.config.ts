import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: ".react",
  },
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@libs": path.resolve(__dirname, "./src/libs"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@customTypes": path.resolve(__dirname, "./src/types"),
      "@public": path.resolve(__dirname, "./src/public"),
    },
  },
});
