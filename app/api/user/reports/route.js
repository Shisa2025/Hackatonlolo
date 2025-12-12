import { run } from "../../../../database/client.js";

const isValidSeverity = (val) => ["low", "medium", "high"].includes(val);

export async function POST(request) {
  try {
    const body = await request.json();
    const { categoryId, title, description, severity, lat, lng } = body ?? {};

    if (
      !categoryId ||
      !title ||
      !description ||
      !severity ||
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !isValidSeverity(severity)
    ) {
      return Response.json(
        { success: false, error: "Missing or invalid fields." },
        { status: 400 }
      );
    }

    const { rows: existingTypes } = await run(
      "SELECT id FROM disaster_type WHERE id = $1 LIMIT 1;",
      [Number(categoryId)],
    );
    if (existingTypes.length === 0) {
      return Response.json(
        { success: false, error: "Category not found." },
        { status: 404 },
      );
    }

    const insertSql = `
      INSERT INTO disaster (disaster_type_id, title, description, severity, status, lat, lng)
      VALUES ($1, $2, $3, $4, 'unverified', $5, $6)
      RETURNING id, disaster_type_id AS categoryId, title, description, severity, status, lat, lng, created_at;
    `;
    const params = [
      Number(categoryId),
      title,
      description,
      severity,
      lat,
      lng,
    ];
    const { rows } = await run(insertSql, params);
    const report = rows[0];

    return Response.json({ success: true, report });
  } catch (err) {
    console.error("POST /api/user/reports failed:", err.message);
    return Response.json(
      { success: false, error: "Invalid JSON or server error." },
      { status: 500 }
    );
  }
}
