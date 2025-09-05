import { neon } from "@neondatabase/serverless";

export async function handler(event, context) {
  try {
    // Підключення до бази через змінну середовища
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Виконуємо SQL-запит
    const logos = await sql`SELECT * FROM logos`;

    return {
      statusCode: 200,
      body: JSON.stringify(logos),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("DB error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database connection failed" }),
    };
  }
}
