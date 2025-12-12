#!/usr/bin/env node
import { Pool } from 'pg';
import { connectionString } from './client.js';

/**
 * Creates database "Hackatonlolo" by default, then ensures schema in that DB.
 * Override with argv[2] or NEON_TARGET_DB.
 */

const dbName = process.argv[2] ?? process.env.NEON_TARGET_DB ?? 'Hackatonlolo';

async function main() {
  if (!dbName) {
    console.error('Database name is required (argv[2] or NEON_TARGET_DB).');
    process.exit(1);
  }

  let maintenancePool;
  let dbPool;

  try {
    // Connect to maintenance DB (postgres) to create target DB.
    const baseUrl = new URL(connectionString);
    baseUrl.pathname = '/postgres';
    maintenancePool = new Pool({
      connectionString: baseUrl.toString(),
      ssl: { rejectUnauthorized: false },
    });

    try {
      await maintenancePool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database created: ${dbName}`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`Database already exists: ${dbName}`);
      } else {
        throw err;
      }
    }

    // Connect to target DB to set up schema (retry briefly in case the DB isn't ready yet).
    const targetUrl = new URL(connectionString);
    targetUrl.pathname = `/${dbName}`;

    const connectWithRetry = async (attempts = 5, delayMs = 800) => {
      let lastErr;
      for (let i = 0; i < attempts; i += 1) {
        try {
          const pool = new Pool({
            connectionString: targetUrl.toString(),
            ssl: { rejectUnauthorized: false },
          });
          await pool.query('SELECT 1');
          return pool;
        } catch (err) {
          lastErr = err;
          // 3D000 invalid_catalog_name means DB not visible yet; retry.
          if (err.code !== '3D000' && err.code !== '57P03') throw err;
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
      throw lastErr;
    };

    dbPool = await connectWithRetry();

    const createAdmin = `
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    const createUsers = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
          CREATE TYPE user_status AS ENUM ('active', 'banned', 'pending');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;
      END
      $$;

      CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        user_name TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        account_status user_status NOT NULL DEFAULT 'active',
        role user_role NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user' AND column_name = 'role'
        ) THEN
          ALTER TABLE "user" ADD COLUMN role user_role NOT NULL DEFAULT 'user';
        END IF;
      END
      $$;
    `;

    const createDisasterType = `
      CREATE TABLE IF NOT EXISTS disaster_type (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        emoji TEXT,
        emoji_cursor TEXT
      );

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'disaster_type' AND column_name = 'emoji'
        ) THEN
          ALTER TABLE disaster_type ADD COLUMN emoji TEXT;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'disaster_type' AND column_name = 'emoji_cursor'
        ) THEN
          ALTER TABLE disaster_type ADD COLUMN emoji_cursor TEXT;
        END IF;
      END
      $$;
    `;

    const createDisaster = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'disaster_severity') THEN
          CREATE TYPE disaster_severity AS ENUM ('low', 'medium', 'high');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'disaster_status') THEN
          CREATE TYPE disaster_status AS ENUM ('unverified', 'verified', 'fake');
        END IF;
      END
      $$;

      CREATE TABLE IF NOT EXISTS disaster (
        id SERIAL PRIMARY KEY,
        disaster_type_id INTEGER NOT NULL REFERENCES disaster_type(id) ON DELETE RESTRICT,
        title TEXT NOT NULL,
        description TEXT,
        severity disaster_severity NOT NULL DEFAULT 'low',
        status disaster_status NOT NULL DEFAULT 'unverified',
        location TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        reported_by INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
        occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'disaster' AND column_name = 'reported_by'
        ) THEN
          ALTER TABLE disaster ADD COLUMN reported_by INTEGER REFERENCES "user"(id) ON DELETE SET NULL;
        END IF;
      END
      $$;
    `;

    await dbPool.query(createAdmin);
    await dbPool.query(createUsers);
    await dbPool.query(createDisasterType);
    await dbPool.query(createDisaster);
    console.log(`Schema ensured in database: ${dbName}`);
  } catch (err) {
    console.error('Create database failed:', err.message);
    process.exitCode = 1;
  } finally {
    await maintenancePool?.end().catch(() => {});
    await dbPool?.end().catch(() => {});
  }
}

main();
