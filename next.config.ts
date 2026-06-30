import type { NextConfig } from "next";

// Supabase self-hosted (HTTP). Se enruta a través de la propia app (proxy)
// para evitar "mixed content" cuando la app se sirve por HTTPS.
const SUPABASE =
  "http://testingsupabase-pre0225supabase-f2876a-38-242-199-137.sslip.io";

const nextConfig: NextConfig = {
  // Salida standalone: genera un server.js mínimo para contenedores (Docker/Dokploy)
  output: "standalone",
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${SUPABASE}/auth/:path*` },
      { source: "/rest/:path*", destination: `${SUPABASE}/rest/:path*` },
      { source: "/realtime/:path*", destination: `${SUPABASE}/realtime/:path*` },
      { source: "/storage/:path*", destination: `${SUPABASE}/storage/:path*` },
      { source: "/functions/:path*", destination: `${SUPABASE}/functions/:path*` },
    ];
  },
};

export default nextConfig;
