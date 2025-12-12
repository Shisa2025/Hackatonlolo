import { run } from "../../../../database/client.js";

export async function GET() {
  try {
    const { rows } = await run(
      `SELECT id, name, description, COALESCE(emoji, emoji_cursor) AS icon
       FROM disaster_type
       ORDER BY id ASC;`,
    );
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/user/categories failed:", err.message);
    return Response.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
