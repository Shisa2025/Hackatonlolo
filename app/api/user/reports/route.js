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

    const report = {
      id: Math.floor(Math.random() * 1_000_000),
      categoryId: Number(categoryId),
      title,
      description,
      severity,
      lat,
      lng,
      createdAt: new Date().toISOString(),
    };

    return Response.json({ success: true, report });
  } catch (err) {
    return Response.json(
      { success: false, error: "Invalid JSON or server error." },
      { status: 500 }
    );
  }
}
