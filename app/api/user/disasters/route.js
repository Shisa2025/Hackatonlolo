import { run } from "../../../../database/client.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get("typeId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const clauses = ["d.lat IS NOT NULL", "d.lng IS NOT NULL"];
  const params = [];

  if (typeId) {
    params.push(Number(typeId));
    clauses.push(`d.disaster_type_id = $${params.length}`);
  }
  if (from) {
    params.push(from);
    clauses.push(`d.occurred_at >= $${params.length}::date`);
  }
  if (to) {
    params.push(to);
    clauses.push(`d.occurred_at < ($${params.length}::date + interval '1 day')`);
  }

  const where = `WHERE ${clauses.join(" AND ")}`;

  try {
    const { rows } = await run(
      `SELECT
         d.id,
         d.title,
         d.description,
         d.severity,
         d.status,
         d.lat,
         d.lng,
         d.created_at,
         d.occurred_at,
         dt.name AS disaster_type_name,
         COALESCE(dt.emoji, dt.emoji_cursor) AS icon
       FROM disaster d
       LEFT JOIN disaster_type dt ON dt.id = d.disaster_type_id
       ${where}
       ORDER BY d.created_at DESC
       LIMIT 200;`,
      params,
    );
    return Response.json({ disasters: rows });
  } catch (err) {
    console.error("GET /api/user/disasters failed:", err.message);
    return Response.json({ error: "Failed to load disasters" }, { status: 500 });
  }
}
