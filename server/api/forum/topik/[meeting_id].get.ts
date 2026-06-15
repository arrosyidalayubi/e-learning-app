export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB tidak terhubung' });

  const meetingId = getRouterParam(event, 'meeting_id');

  try {
    // Mengambil daftar topik sekaligus menghitung jumlah balasannya menggunakan Subquery
    const query = `
      SELECT 
        t.id, 
        t.judul, 
        u.nama as dosen,
        t.created_at as waktu,
        (SELECT COUNT(*) FROM forum_balasan b WHERE b.topik_id = t.id) as totalBalasan
      FROM forum_topik t
      JOIN users u ON t.dosen_id = u.id
      WHERE t.pertemuan_id = ?
      ORDER BY t.created_at ASC
    `;
    
    const { results } = await env.DB.prepare(query).bind(meetingId).all();

    return { success: true, data: results };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error Server';
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});