#!/usr/bin/env node
import { Pool } from 'pg';
import { connectionString } from './client.js';

/**
 * Drops a database with the provided name.
 * Usage: node database/deleteDatabase.js mydb
 * Defaults to NEON_TARGET_DB or "Hackatonlolo" if no name is given.
 */

const dbName = process.argv[2] ?? process.env.NEON_TARGET_DB ?? 'Hackatonlolo';

async function main() {
  if (!dbName) {
    console.error('Database name is required (argv[2] or NEON_TARGET_DB).');
    process.exit(1);
  }

  // Connect to a maintenance database (postgres) so we can drop the target DB.
  const url = new URL(connectionString);
  url.pathname = '/postgres';
  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Terminate existing connections to the target DB.
    await pool.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [dbName],
    );

    await pool.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Database dropped (if existed): ${dbName}`);
  } catch (err) {
    console.error('Delete database failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
}

main();
