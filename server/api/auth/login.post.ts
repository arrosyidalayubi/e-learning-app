export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB Error' });

  const body = await readBody(event);
  const { id, password } = body;

  try {
    // Cari user di D1
    const user = await env.DB.prepare(`SELECT id, nama, email, role FROM users WHERE id = ? AND password = ?`)
      .bind(id, password)
      .first();

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'NIM/NIDN atau Password salah!' });
    }

    // Set Cookie secara aman dari Server
    setCookie(event, 'auth_user', JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // Aktif 1 Minggu
      path: '/',
    });

    return { success: true, user };
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || 'Server Error' });
  }
});