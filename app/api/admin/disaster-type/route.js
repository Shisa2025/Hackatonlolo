import { NextResponse } from 'next/server';
import { pool } from '../../../../database/client.js';

const badRequest = (message) => NextResponse.json({ error: message }, { status: 400 });

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT id, name, description, emoji, emoji_cursor FROM disaster_type ORDER BY name ASC');
    return NextResponse.json({ disaster_types: rows }, { status: 200 });
  } catch (err) {
    console.error('List disaster type error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    return badRequest('Invalid JSON body');
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const description = typeof payload.description === 'string' ? payload.description.trim() : null;
  const emoji = typeof payload.emoji === 'string' ? payload.emoji.trim() : null;
  const emojiCursor = typeof payload.emoji_cursor === 'string' ? payload.emoji_cursor.trim() : null;

  if (!name || name.length < 2) return badRequest('Name is required');

  try {
    const { rows } = await pool.query(
      `INSERT INTO disaster_type (name, description, emoji, emoji_cursor) VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, emoji = EXCLUDED.emoji, emoji_cursor = EXCLUDED.emoji_cursor
       RETURNING id, name, description, emoji, emoji_cursor`,
      [name, description, emoji, emojiCursor],
    );
    return NextResponse.json({ disaster_type: rows[0], message: 'Disaster type saved.' }, { status: 201 });
  } catch (err) {
    console.error('Create disaster type error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
