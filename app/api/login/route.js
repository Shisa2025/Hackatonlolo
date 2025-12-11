import { NextResponse } from 'next/server';
import { scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { pool } from '../../../database/client.js';

const scrypt = promisify(_scrypt);
const ALLOWED_ROLES = new Set(['admin', 'user']);

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

async function verifyPassword(stored, candidate) {
  // stored format: scrypt:salt:hexhash
  if (!stored || !stored.startsWith('scrypt:')) {
    return false;
  }
  const [, salt, hexHash] = stored.split(':');
  if (!salt || !hexHash) return false;
  try {
    const storedBuf = Buffer.from(hexHash, 'hex');
    const derived = await scrypt(candidate, salt, storedBuf.length);
    return timingSafeEqual(derived, storedBuf);
  } catch {
    return false;
  }
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

  if (!email || !email.includes('@')) return badRequest('Email is required');
  if (!password) return badRequest('Password is required');
  if (!ALLOWED_ROLES.has(role)) return badRequest('Invalid role');

  try {
    if (role === 'admin') {
      const { rows } = await pool.query('SELECT id, email, password_hash, created_at FROM admin WHERE email = $1 LIMIT 1', [email]);
      if (rows.length === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const admin = rows[0];
      const ok = await verifyPassword(admin.password_hash, password);
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      return NextResponse.json(
        {
          admin: { id: admin.id, email: admin.email, created_at: admin.created_at },
          message: 'Admin login successful.',
        },
        { status: 200 },
      );
    }

    // user login
    const { rows } = await pool.query(
      'SELECT id, email, user_name, password_hash, account_status, role, created_at FROM "user" WHERE email = $1 LIMIT 1',
      [email],
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const user = rows[0];
    if (user.account_status === 'banned') {
      return NextResponse.json({ error: 'Account is banned' }, { status: 403 });
    }
    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const canCreateDisaster = user.account_status === 'active';
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          user_name: user.user_name,
          account_status: user.account_status,
          role: user.role,
          created_at: user.created_at,
          can_create_disaster: canCreateDisaster,
        },
        message: 'User login successful.',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
