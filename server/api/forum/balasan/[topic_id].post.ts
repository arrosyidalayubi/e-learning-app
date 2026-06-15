export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB tidak terhubung' });

  // BACA IDENTITAS DARI COOKIE
  const authUserStr = getCookie(event, 'auth_user');
  if (!authUserStr) throw createError({ statusCode: 401, statusMessage: 'Sesi habis, silakan login ulang.' });
  
  const authUser = JSON.parse(authUserStr);
  const userId = authUser.id; // Menggunakan ID yang sedang login

  const topicId = getRouterParam(event, 'topic_id');
  const body = await readBody(event);
  const pesan = body.pesan;

  if (!pesan) throw createError({ statusCode: 400, statusMessage: 'Pesan tidak boleh kosong' });

  try {
    await env.DB.prepare(
      `INSERT INTO forum_balasan (topik_id, user_id, pesan) VALUES (?, ?, ?)`
    ).bind(topicId, userId, pesan).run();

    return { success: true, message: 'Balasan berhasil dikirim' };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error Server' });
  }
});