import { neon } from '@netlify/neon';

export async function handler(event) {
  try {
    const { userId, logoId } = JSON.parse(event.body);
    const sql = neon(); // використовує NETLIFY_DATABASE_URL

    const [logo] = await sql`SELECT * FROM logos WHERE id = ${logoId}`;
    if (!logo) return { statusCode: 404, body: JSON.stringify({ message: "Логотип не знайдено" }) };

    const [user] = await sql`
      UPDATE users
      SET balance = balance + ${logo.price}
      WHERE id = ${userId}
      RETURNING *
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Логотип "${logo.name}" куплено!`,
        newBalance: user.balance
      })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Помилка сервера", error: error.message }) };
  }
}
