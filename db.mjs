import { Pool } from "pg";

let pool = null;

const getDatabaseUrl = () => process.env.DATABASE_URL;

const getPool = () => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    const error = new Error("DATABASE_URL não configurada. Configure uma URL válida do PostgreSQL para usar o módulo de banco.");
    error.code = "DATABASE_URL_MISSING";
    throw error;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
};

export const query = async (text, params = []) => {
  const activePool = getPool();
  return activePool.query(text, params);
};

export const transaction = async (callback) => {
  const activePool = getPool();
  const client = await activePool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const closePool = async () => {
  if (!pool) return;
  await pool.end();
  pool = null;
};
