// Config pública de Supabase resuelta en runtime.
// En el navegador se lee de window.__ENV (inyectado por el layout en cada request),
// lo que permite cambiar la URL/clave sin reconstruir la imagen Docker.

type PublicEnv = { SUPABASE_URL: string; SUPABASE_ANON_KEY: string };

declare global {
  interface Window {
    __ENV?: PublicEnv;
  }
}

export function publicEnv(): PublicEnv {
  if (typeof window !== "undefined" && window.__ENV) {
    return window.__ENV;
  }
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}
