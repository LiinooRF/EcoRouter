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
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-950 to-emerald-950 text-white p-12">
        <Link href="/" className="text-2xl font-extrabold">
          Eco<span className="text-emerald-400">Route</span> Logistic AI
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Toda tu operación logística,<br />en un solo lugar.
          </h2>
          <p className="mt-4 text-slate-300 max-w-md">
            Asignación automática de cargas, seguimiento GPS en tiempo real y
            trazabilidad de extremo a extremo para la flota de Transportes
            Sur-Austral.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Acceso protegido con autenticación de dos factores (RNF-03).
        </p>
      </div>

      {/* Panel derecho (formulario) */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
