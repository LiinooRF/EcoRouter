"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Truck, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

type Step = "cred" | "mfa";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("cred");
  const [email, setEmail] = useState("admin@ecoroute.cl");
  const [password, setPassword] = useState("EcoRoute2026!");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      toast.error("No se pudo iniciar sesión", { description: error.message });
      return;
    }

    // ¿Requiere segundo factor? (RNF-03 — caso de uso «Autenticar mediante 2FA»)
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if (totp) {
        setFactorId(totp.id);
        setStep("mfa");
        setLoading(false);
        return;
      }
    }

    toast.success("Sesión iniciada");
    router.push("/app");
    router.refresh();
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    if (error) {
      setLoading(false);
      toast.error("Código inválido", { description: error.message });
      return;
    }
    toast.success("Verificación 2FA correcta");
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <Truck className="size-7 text-emerald-500" />
          Eco<span className="text-emerald-500">Route</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Transportes Sur-Austral
        </p>
      </div>

      {step === "cred" ? (
        <form onSubmit={handleCredentials} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo corporativo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Ingresar
          </Button>

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Credenciales demo</p>
            admin@ecoroute.cl · conductor@ecoroute.cl · soporte@ecoroute.cl
            <br />
            Contraseña: <code>EcoRoute2026!</code>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMfa} className="space-y-4">
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div className="rounded-full bg-emerald-100 p-3">
              <ShieldCheck className="size-6 text-emerald-600" />
            </div>
            <p className="font-semibold">Verificación en dos pasos</p>
            <p className="text-sm text-muted-foreground">
              Ingresa el código de 6 dígitos de tu app de autenticación.
            </p>
          </div>
          <Input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center text-2xl tracking-[0.5em] font-mono h-14"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Verificar y entrar
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep("cred");
              setCode("");
            }}
          >
            <ArrowLeft className="size-4" /> Volver
          </Button>
        </form>
      )}
    </div>
  );
}
