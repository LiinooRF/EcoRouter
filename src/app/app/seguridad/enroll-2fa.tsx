"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Loader2, QrCode } from "lucide-react";

export function Enroll2FA() {
  const supabase = createClient();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function refresh() {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find((f) => f.status === "verified");
    setEnrolled(!!verified);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startEnroll() {
    setLoading(true);
    // Limpia factores sin verificar previos
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.all ?? []) {
      if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `EcoRoute-${Date.now()}`,
    });
    setLoading(false);
    if (error) {
      toast.error("No se pudo iniciar el enrolamiento", { description: error.message });
      return;
    }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
  }

  async function verify() {
    if (!factorId) return;
    setVerifying(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    setVerifying(false);
    if (error) {
      toast.error("Código inválido", { description: error.message });
      return;
    }
    toast.success("2FA activado correctamente");
    setQr(null);
    setSecret(null);
    setCode("");
    refresh();
  }

  async function disable() {
    const { data } = await supabase.auth.mfa.listFactors();
    for (const f of data?.all ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    toast.success("2FA desactivado");
    refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Cargando estado de seguridad…
      </div>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enrolled ? (
            <ShieldCheck className="size-5 text-emerald-600" />
          ) : (
            <ShieldOff className="size-5 text-amber-600" />
          )}
          Autenticación de dos factores (2FA)
        </CardTitle>
        <CardDescription>
          Protege el acceso a información sensible — requisito de seguridad
          RNF-03.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrolled ? (
          <>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
              ✓ El 2FA está <b>activado</b> en tu cuenta. En el próximo inicio de
              sesión se te pedirá el código de tu app de autenticación.
            </div>
            <Button variant="outline" onClick={disable}>
              <ShieldOff className="size-4" /> Desactivar 2FA
            </Button>
          </>
        ) : qr ? (
          <>
            <p className="text-sm text-muted-foreground">
              1. Escanea este código QR con Google Authenticator, Authy o similar.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Código QR para 2FA" className="size-48 border rounded-lg bg-white p-2" />
            {secret && (
              <p className="text-xs text-muted-foreground break-all">
                ¿No puedes escanear? Clave: <code className="font-mono">{secret}</code>
              </p>
            )}
            <p className="text-sm text-muted-foreground">2. Ingresa el código generado:</p>
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="text-center tracking-[0.4em] font-mono"
              />
              <Button onClick={verify} disabled={verifying || code.length !== 6} className="bg-emerald-500 hover:bg-emerald-600">
                {verifying && <Loader2 className="size-4 animate-spin" />}
                Verificar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Aún no tienes 2FA activado. Actívalo para reforzar la seguridad de
              tu cuenta.
            </p>
            <Button onClick={startEnroll} className="bg-emerald-500 hover:bg-emerald-600">
              <QrCode className="size-4" /> Activar 2FA
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
