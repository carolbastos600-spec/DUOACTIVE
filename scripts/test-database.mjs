import { closePool, query } from "../db.mjs";

const run = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("DATABASE_URL não configurada. Nenhuma conexão foi testada.");
    return;
  }

  const result = await query("SELECT NOW() as current_time");
  console.log("Conexão com PostgreSQL OK.");
  console.log(result.rows[0].current_time);
};

try {
  await run();
} catch (error) {
  console.error("Erro ao testar conexão com PostgreSQL:", error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
