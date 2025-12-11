import { Pool } from 'pg';

// Centralized Neon connection. Prefer setting NEON_DATABASE_URL in .env.local.
// Falls back to the provided connection string if env is missing.
// Use NEON_DATABASE_URL to control which DB the app connects to.
// Fallback points directly to the Hackatonlolo database to match creation script.
export const connectionString =
  process.env.NEON_DATABASE_URL ??
  "postgresql://neondb_owner:npg_B0KFTgyPabH3@ep-noisy-sky-a1m0lmf4-pooler.ap-southeast-1.aws.neon.tech/Hackatonlolo?sslmode=require&channel_binding=require";

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function run(queryText, params = []) {
  return pool.query(queryText, params);
}

export async function closePool() {
  await pool.end().catch(() => {});
}
