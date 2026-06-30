# EcoRoute Logistic AI 🚚

Prototipo funcional de plataforma de gestión logística para **Transportes Sur-Austral**
(flota de 150 camiones, ruta Santiago ⇄ Punta Arenas). Desarrollado para la
asignatura **Ingeniería de Software (RQY1102)** — Evaluación Parcial 3.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **shadcn/ui** (Base UI) + **Tailwind CSS v4**
- **Supabase** self-hosted (PostgreSQL + Auth/GoTrue con **2FA TOTP** + RLS)
- **Leaflet** + OpenStreetMap para el mapa GPS
- Despliegue con **Docker** (salida standalone) sobre **Dokploy**

## Requisitos funcionales implementados

| Código | Funcionalidad | Dónde |
|--------|---------------|-------|
| RF-01/02 | Asignación automática de cargas según licencia/disponibilidad | `/app/asignar` |
| RF-03 | Visualización GPS en tiempo real | `/app/mapa` |
| RF-04 | Portal del cliente (consulta por nº de guía) | `/track` |
| RF-05 | Actualización del estado del despacho | `/app/conductor` |
| RF-06 | Cálculo automático de viáticos | `/app/asignar` |
| RF-07/08 | Alertas climáticas y panel de alertas | `/app/alertas` |
| RF-09 | Historial de despachos | `/app/despachos` |
| RF-10 | Reportes de desempeño (export CSV) | `/app/reportes` |
| RNF-03 | Seguridad: 2FA TOTP + RLS | `/login`, `/app/seguridad` |
| RNF-06 | Interfaz mobile-first para conductores | `/app/conductor` |
| RNF-10 | Trazabilidad (bitácora) | tabla `bitacora` |

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa con tus credenciales de Supabase
npm run dev                  # http://localhost:3000
```

### Migraciones de base de datos

```bash
# aplica supabase/migrations/* a la BD indicada en SUPABASE_DB_URL
SUPABASE_DB_URL="postgresql://..." node scripts/apply-migrations.mjs
```

### Usuarios demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@ecoroute.cl | EcoRoute2026! |
| Conductor | conductor@ecoroute.cl | EcoRoute2026! |
| Soporte | soporte@ecoroute.cl | EcoRoute2026! |

## Estrategia de ramas (control de versiones)

```
main      → producción (lo que despliega Dokploy)
develop   → integración
feature/* → una rama por funcionalidad, integrada con merge --no-ff
```

Ramas de funcionalidad: `feature/infra-supabase`, `feature/auth-2fa`,
`feature/app-shell-dashboard`, `feature/mapa-gps`, `feature/asignacion`,
`feature/alertas-reportes`, `feature/portal-conductor`, `feature/deploy`.

## Despliegue (Docker / Dokploy)

La imagen usa la salida **standalone** de Next.js. La configuración pública de
Supabase se inyecta en **runtime** (`window.__ENV`), por lo que basta con definir
las variables de entorno en Dokploy (no se requieren build-args):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

```bash
docker build -t ecoroute .
docker run -p 3000:3000 --env-file .env.local ecoroute
```
