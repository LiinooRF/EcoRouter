import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/public-env";

/** Cliente de Supabase para componentes que corren en el navegador. */
export function createClient() {
  const env = publicEnv();
  return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
