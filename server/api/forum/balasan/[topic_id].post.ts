export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB tidak terhubung' });

  const topicId = getRouterParam(event, 'topic_id');
  const body = await readBody(event);

  try {
    // Karena belum ada sistem Login/Auth, kita hardcode sementara 
    // menggunakan ID Mahasiswa yang kita buat di seeder (Arrosyid Al Ayubi)
    const userId = 'M-202601'; 
    const pesan = body.pesan;

    if (!pesan) throw createError({ statusCode: 400, statusMessage: 'Pesan tidak boleh kosong' });

    // Insert ke D1
    await env.DB.prepare(
      `INSERT INTO forum_balasan (topik_id, user_id, pesan) VALUES (?, ?, ?)`
    ).bind(topicId, userId, pesan).run();

    return { success: true, message: 'Balasan berhasil dikirim' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error Server';
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});