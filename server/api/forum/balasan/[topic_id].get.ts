export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB tidak terhubung' });

  const topicId = getRouterParam(event, 'topic_id');

  try {
    // 1. Ambil detail instruksi/pertanyaan topiknya
    const topikDetail = await env.DB.prepare(`
      SELECT t.*, u.nama as dosen 
      FROM forum_topik t 
      JOIN users u ON t.dosen_id = u.id 
      WHERE t.id = ?
    `).bind(topicId).first();

    if (!topikDetail) throw createError({ statusCode: 404, statusMessage: 'Topik tidak ditemukan' });

    // 2. Ambil semua balasan yang ada di topik tersebut
    const balasanQuery = `
      SELECT 
        b.id, 
        b.pesan, 
        b.created_at as waktu, 
        u.nama, 
        u.role,
        SUBSTR(u.nama, 1, 2) as inisial
      FROM forum_balasan b
      JOIN users u ON b.user_id = u.id
      WHERE b.topik_id = ?
      ORDER BY b.created_at ASC
    `;
    const { results: daftarBalasan } = await env.DB.prepare(balasanQuery).bind(topicId).all();

    return { 
      success: true, 
      data: {
        topik: topikDetail,
        balasan: daftarBalasan
      }
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error Server';
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});