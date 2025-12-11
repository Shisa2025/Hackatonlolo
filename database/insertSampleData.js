#!/usr/bin/env node
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Pool } from 'pg';
import { connectionString } from './client.js';

const scrypt = promisify(_scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${Buffer.from(derived).toString('hex')}`;
}

async function main() {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const admins = [
    { email: 'yshisa001@mymail.sim.edu.sg', password: '123456' },
    { email: 'monica.9.ais@gmail.com', password: 'Monicacheng' },
  ];

  const users = [
    { email: 'shisa1@example.com', user_name: 'shisa1', password: '123456', account_status: 'active', role: 'user' },
    { email: 'shisa2@example.com', user_name: 'shisa2', password: '123456', account_status: 'pending', role: 'user' },
    { email: '123@gmail.com', user_name: 'Jasmine', password: '123456', account_status: 'pending', role: 'user' }
  ];

  const disasterTypes = [
    { name: 'Earthquake', description: 'Seismic event', emoji: '🌎', emoji_cursor: 'earthquake' },
    { name: 'Flood', description: 'Flooding incident', emoji: '🌊', emoji_cursor: 'water_wave' },
  ];

  const disasters = [
    {
      title: 'Minor quake downtown',
      description: 'Reported tremors near central district',
      severity: 'medium',
      status: 'unverified',
      location: 'Downtown',
      typeName: 'Earthquake',
      userEmail: 'shisa1@example.com',
    },
    {
      title: 'Aftershock detected',
      description: 'Sensors flagged a small aftershock',
      severity: 'low',
      status: 'unverified',
      location: 'Industrial zone',
      typeName: 'Earthquake',
      userEmail: 'shisa1@example.com',
    },
    {
      title: 'River rising',
      description: 'Water levels elevated after heavy rain',
      severity: 'medium',
      status: 'unverified',
      location: 'Riverside',
      typeName: 'Flood',
      userEmail: 'shisa2@example.com',
    },
    {
      title: 'Levee seepage',
      description: 'Small seep observed along levee wall',
      severity: 'low',
      status: 'unverified',
      location: 'Levee district',
      typeName: 'Flood',
      userEmail: 'shisa2@example.com',
    },
  ];

  try {
    // admins
    for (const admin of admins) {
      const passwordHash = await hashPassword(admin.password);
      await pool.query(
        `INSERT INTO admin (email, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [admin.email, passwordHash],
      );
      console.log(`Upserted admin: ${admin.email}`);
    }

    // users
    for (const user of users) {
      const passwordHash = await hashPassword(user.password);
      await pool.query(
        `INSERT INTO "user" (email, user_name, password_hash, account_status, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, account_status = EXCLUDED.account_status, role = EXCLUDED.role`,
        [user.email, user.user_name, passwordHash, user.account_status, user.role],
      );
      console.log(`Upserted user: ${user.email}`);
    }

    // disaster types
    for (const dt of disasterTypes) {
      await pool.query(
        `INSERT INTO disaster_type (name, description, emoji, emoji_cursor)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, emoji = EXCLUDED.emoji, emoji_cursor = EXCLUDED.emoji_cursor`,
        [dt.name, dt.description, dt.emoji, dt.emoji_cursor],
      );
      console.log(`Upserted disaster type: ${dt.name}`);
    }

    // disasters: map type name and user email to IDs
    for (const d of disasters) {
      const typeRes = await pool.query('SELECT id FROM disaster_type WHERE name = $1 LIMIT 1', [d.typeName]);
      const userRes = await pool.query('SELECT id FROM "user" WHERE email = $1 LIMIT 1', [d.userEmail]);
      if (typeRes.rowCount === 0 || userRes.rowCount === 0) {
        console.warn(`Skipping disaster "${d.title}" due to missing type/user`);
        continue;
      }
      const disasterTypeId = typeRes.rows[0].id;
      await pool.query(
        `INSERT INTO disaster (disaster_type_id, title, description, severity, status, location)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [disasterTypeId, d.title, d.description, d.severity, d.status, d.location],
      );
      console.log(`Inserted disaster: ${d.title}`);
    }

    console.log('Sample data inserted.');
  } catch (err) {
    console.error('Insert sample data failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
}

main();
