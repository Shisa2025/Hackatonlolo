import { run } from "../../../../database/client.js";

const isValidSeverity = (val) => ["low", "medium", "high"].includes(val);

export async function POST(request) {
  try {
    const body = await request.json();
    const { categoryId, title, description, severity, lat, lng, userId } = body ?? {};
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const categoryIdNum = Number(categoryId);
    const reportedBy = Number.isFinite(Number(userId)) ? Number(userId) : null;

    if (
      !categoryId ||
      !title ||
      !description ||
      !severity ||
      !Number.isFinite(latNum) ||
      !Number.isFinite(lngNum) ||
      !isValidSeverity(severity)
    ) {
      return Response.json(
        { success: false, error: "Missing or invalid fields." },
        { status: 400 }
      );
    }

    const { rows: existingTypes } = await run(
      "SELECT id FROM disaster_type WHERE id = $1 LIMIT 1;",
      [categoryIdNum],
    );
    if (existingTypes.length === 0) {
      return Response.json(
        { success: false, error: "Category not found." },
        { status: 404 },
      );
    }

    // Block deployment if a same-type disaster exists within 1km in the last hour
    const proximitySql = `
      SELECT 1
      FROM disaster
      WHERE disaster_type_id = $1
        AND lat IS NOT NULL AND lng IS NOT NULL
        AND ACOS(
          LEAST(
            1,
            GREATEST(
              -1,
              SIN(RADIANS(lat)) * SIN(RADIANS($2)) +
              COS(RADIANS(lat)) * COS(RADIANS($2)) * COS(RADIANS(lng - $3))
            )
          )
        ) * 6371 <= 1
        AND ABS(EXTRACT(EPOCH FROM (COALESCE(occurred_at, created_at) - NOW()))) <= 3600
      LIMIT 1;
    `;
    const { rows: nearby } = await run(proximitySql, [categoryIdNum, latNum, lngNum]);
    if (nearby.length > 0) {
      return Response.json(
        { success: false, error: "Deployment failed: a similar disaster exists within 1km in the last hour." },
        { status: 409 },
      );
    }

    const insertSql = `
      INSERT INTO disaster (disaster_type_id, title, description, severity, status, lat, lng, reported_by)
      VALUES ($1, $2, $3, $4, 'unverified', $5, $6, $7)
      RETURNING id, disaster_type_id AS categoryId, title, description, severity, status, lat, lng, reported_by, created_at;
    `;
    const params = [
      categoryIdNum,
      title,
      description,
      severity,
      latNum,
      lngNum,
      reportedBy,
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
