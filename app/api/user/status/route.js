import { NextResponse } from 'next/server';
import { pool } from '../../../../database/client.js';

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const emailParam = searchParams.get('email');

  if (!idParam && !emailParam) return badRequest('id or email is required');

  const clauses = [];
  const params = [];
  if (idParam) {
    const idNum = Number(idParam);
    if (!Number.isInteger(idNum) || idNum <= 0) return badRequest('Invalid id');
    params.push(idNum);
    clauses.push(`id = $${params.length}`);
  }
  if (emailParam) {
    params.push(emailParam.toLowerCase());
    clauses.push(`email = $${params.length}`);
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, email, user_name, account_status, role, created_at
       FROM "user"
       WHERE ${clauses.join(' OR ')}
       LIMIT 1`,
      params,
    );
    if (rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(
      { user: rows[0], can_create_disaster: rows[0].account_status === 'active' },
      { status: 200 },
    );
  } catch (err) {
    console.error('User status fetch error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
