import { NextResponse } from 'next/server';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { pool } from '../../../database/client.js';

const scrypt = promisify(_scrypt);
const ALLOWED_ROLES = new Set(['admin', 'user']);

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${Buffer.from(derived).toString('hex')}`;
}

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    return badRequest('Invalid JSON body');
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const role = typeof payload.role === 'string' ? payload.role : 'user';
  const userName = typeof payload.user_name === 'string' ? payload.user_name.trim() : '';
  const accountStatus = 'active'; // default to active on registration

  if (!email || !email.includes('@')) return badRequest('Email is required');
  if (!password || password.length < 6) return badRequest('Password must be at least 6 characters');
  if (!ALLOWED_ROLES.has(role)) return badRequest('Invalid role');
  if (role === 'user' && (!userName || userName.length < 3)) return badRequest('Username is required');

  try {
    if (role === 'admin') {
      // Ensure uniqueness across admin table
      const existingAdmin = await pool.query('SELECT 1 FROM admin WHERE email = $1 LIMIT 1', [email]);
      if (existingAdmin.rowCount > 0) {
        return NextResponse.json({ error: 'Email already registered as admin' }, { status: 409 });
      }
      const passwordHash = await hashPassword(password);
      const { rows } = await pool.query(
        `INSERT INTO admin (email, password_hash) VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [email, passwordHash],
      );
      return NextResponse.json({ admin: rows[0], message: 'Admin registration successful.' }, { status: 201 });
    }

    // role === 'user'
    const existingUser = await pool.query('SELECT 1 FROM "user" WHERE email = $1 LIMIT 1', [email]);
    if (existingUser.rowCount > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const { rows } = await pool.query(
      `INSERT INTO "user" (email, user_name, password_hash, account_status, role) VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, user_name, account_status, role, created_at`,
      [email, userName, passwordHash, accountStatus, role],
    );
    return NextResponse.json({ user: rows[0], message: 'User registration successful.' }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
