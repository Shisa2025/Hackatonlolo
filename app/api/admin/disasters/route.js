import { NextResponse } from 'next/server';
import { pool } from '../../../../database/client.js';

const ALLOWED_STATUS = new Set(['unverified', 'verified', 'fake']);

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('typeId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const clauses = [];
  const params = [];

  if (typeId) {
    params.push(Number(typeId));
    clauses.push(`d.disaster_type_id = $${params.length}`);
  }
  if (from) {
    params.push(from);
    clauses.push(`d.occurred_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    clauses.push(`d.occurred_at <= $${params.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.title, d.description, d.severity, d.status, d.location, d.lat, d.lng, d.occurred_at, d.created_at,
              dt.name as disaster_type_name, d.disaster_type_id
       FROM disaster d
       LEFT JOIN disaster_type dt ON dt.id = d.disaster_type_id
       ${where}
       ORDER BY d.occurred_at DESC, d.created_at DESC`,
      params,
    );
    return NextResponse.json({ disasters: rows }, { status: 200 });
  } catch (err) {
    console.error('List disasters error:', err);
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
  const status = typeof payload.status === 'string' ? payload.status : '';

  if (!id || !Number.isInteger(id)) return badRequest('Invalid id');
  if (!ALLOWED_STATUS.has(status)) return badRequest('Invalid status');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateRes = await client.query(
      `UPDATE disaster SET status = $1 WHERE id = $2 RETURNING id, title, status, reported_by`,
      [status, id],
    );
    if (updateRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return badRequest('Disaster not found');
    }

    const disasterRow = updateRes.rows[0];

    if (status === 'fake' && disasterRow.reported_by) {
      // Count fake disasters created by this user
      const { rows: fakeCounts } = await client.query(
        `SELECT COUNT(*)::int AS fake_count
         FROM disaster
         WHERE reported_by = $1 AND status = 'fake'`,
        [disasterRow.reported_by],
      );
      const fakeCount = fakeCounts[0]?.fake_count ?? 0;
      if (fakeCount >= 3) {
        await client.query(
          `UPDATE "user" SET account_status = 'pending' WHERE id = $1 AND account_status <> 'banned'`,
          [disasterRow.reported_by],
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json(
      { disaster: { id: disasterRow.id, title: disasterRow.title, status: disasterRow.status }, message: 'Disaster status updated.' },
      { status: 200 },
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update disaster status error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  } finally {
    client.release();
  }
}
