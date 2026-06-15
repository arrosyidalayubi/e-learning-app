export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung' });

  try {
    // Ambil semua data user, urutkan dari yang terbaru
    const { results } = await env.DB.prepare(`
      SELECT id, nama, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `).all();

    return { success: true, data: results };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error Server';
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});