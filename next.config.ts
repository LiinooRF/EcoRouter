import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Salida standalone: genera un server.js mínimo para contenedores (Docker/Dokploy)
  output: "standalone",
};

export default nextConfig;
