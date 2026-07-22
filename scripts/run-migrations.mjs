import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, query, transaction } from "../db.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const migrationsDir = join(rootDir, "migrations");

const loadMigrations = async () => {
  const entries = await readdir(migrationsDir);
  return entries
    .filter((entry) => entry.endsWith(".sql"))
    .sort()
    .map((entry) => ({ name: entry, path: join(migrationsDir, entry) }));
};

const ensureSchemaMigrationsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const run = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("DATABASE_URL não configurada. Nenhuma migration foi executada.");
    return;
  }

  await ensureSchemaMigrationsTable();
  const migrations = await loadMigrations();

  for (const migration of migrations) {
    const existing = await query("SELECT 1 FROM schema_migrations WHERE name = $1", [migration.name]);
    if (existing.rowCount > 0) {
      continue;
    }

    const sql = await readFile(migration.path, "utf8");

    try {
      await transaction(async (client) => {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [migration.name]);
      });
      console.log(`Migration aplicada: ${migration.name}`);
    } catch (error) {
      console.error(`Falha ao aplicar ${migration.name}: ${error.message}`);
      throw error;
    }
  }
};

try {
  await run();
} catch (error) {
  console.error("Erro ao executar migrations:", error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
