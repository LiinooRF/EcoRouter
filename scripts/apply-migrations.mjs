/**
 * Aplica las migraciones de supabase/migrations en orden contra la BD.
 * Uso: SUPABASE_DB_URL="postgresql://..." node scripts/apply-migrations.mjs
 * (se usa porque el Supabase self-hosted no expone TLS y la CLI lo exige)
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Falta SUPABASE_DB_URL en el entorno.");
  process.exit(1);
}

const dir = "supabase/migrations";
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new pg.Client({ connectionString: url, ssl: false });
await client.connect();
console.log("Conectado a la base de datos.\n");

for (const f of files) {
  const sql = readFileSync(join(dir, f), "utf8");
  process.stdout.write(`▶ Aplicando ${f} ... `);
  try {
    await client.query(sql);
    console.log("OK");
  } catch (e) {
    console.log("ERROR");
    console.error(e.message);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log("\n✓ Migraciones aplicadas correctamente.");
