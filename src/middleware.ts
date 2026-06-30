import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto estáticos, imágenes y las rutas que se
     * reenvían a Supabase (proxy): auth, rest, realtime, storage, functions.
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/|rest/|realtime/|storage/|functions/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
