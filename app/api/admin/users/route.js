import { NextResponse } from 'next/server';
import { pool } from '../../../../database/client.js';

const ALLOWED_STATUS = new Set(['active', 'banned', 'pending']);

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, user_name, account_status, role, created_at
       FROM "user"
       ORDER BY (account_status = 'pending') DESC, created_at DESC`,
    );
    return NextResponse.json({ users: rows }, { status: 200 });
  } catch (err) {
    console.error('List users error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    return badRequest('Invalid JSON body');
  }

  const id = Number(payload.id);
  const status = typeof payload.account_status === 'string' ? payload.account_status : '';

  if (!id || !Number.isInteger(id)) return badRequest('Invalid id');
  if (!ALLOWED_STATUS.has(status)) return badRequest('Invalid status');

  try {
    const { rowCount, rows } = await pool.query(
      `UPDATE "user" SET account_status = $1 WHERE id = $2 RETURNING id, email, user_name, account_status, role, created_at`,
      [status, id],
    );
    if (rowCount === 0) return badRequest('User not found');
    return NextResponse.json({ user: rows[0], message: 'Status updated.' }, { status: 200 });
  } catch (err) {
    console.error('Update user status error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
