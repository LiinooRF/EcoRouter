import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo (branding) */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#1c1d22] p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-sm bg-orange-600 font-mono text-[11px] font-bold text-white">
            ER
          </span>
          <span className="font-semibold tracking-tight">EcoRoute</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Toda la operación logística en un solo lugar.
          </h2>
          <p className="mt-4 max-w-md text-white/55">
            Asignación de cargas, seguimiento GPS y trazabilidad para la flota de
            Transportes Sur-Austral.
          </p>
        </div>
        <p className="font-mono text-xs text-white/35">
          Acceso con autenticación de dos factores.
        </p>
      </div>

      {/* Panel derecho (formulario) */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
