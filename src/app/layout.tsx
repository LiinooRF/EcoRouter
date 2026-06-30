import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoRoute Logistic AI — Transportes Sur-Austral",
  description:
    "Plataforma centralizada de gestión logística: asignación de cargas, GPS en tiempo real, trazabilidad y control operativo.",
};

// Render dinámico para leer la configuración pública (Supabase) en runtime,
// de modo que la imagen Docker no dependa de variables en tiempo de build.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV=${JSON.stringify({
              SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
              SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
            })}`,
          }}
        />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
