import { Enroll2FA } from "./enroll-2fa";

export default function SeguridadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seguridad</h1>
        <p className="text-muted-foreground text-sm">
          Gestiona la autenticación de dos factores de tu cuenta.
        </p>
      </div>
      <Enroll2FA />
    </div>
  );
}
