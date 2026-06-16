export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB Error' });

  const meetingId = getRouterParam(event, 'meeting_id');

  try {
    const { results } = await env.DB.prepare(`SELECT * FROM pertemuan_materi WHERE pertemuan_id = ? ORDER BY created_at ASC`)
      .bind(meetingId).all();
    return { success: true, data: results };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil materi' });
  }
});