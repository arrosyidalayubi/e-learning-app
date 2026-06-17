export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung' });

  const courseId = getRouterParam(event, 'course_id');

  try {
    // Ambil rekapitulasi nilai tugas kuis mahasiswa pada mata kuliah ini
    const { results } = await env.DB.prepare(`
      SELECT 
        u.id as nim,
        u.nama as nama_mahasiswa,
        p.pertemuan as pertemuan_ke,
        nk.jenis as jenis_kuis,
        nk.nilai,
        nk.created_at as waktu_pengerjaan
      FROM nilai_kuis nk
      JOIN users u ON nk.user_id = u.id
      JOIN pertemuan p ON nk.pertemuan_id = p.id
      WHERE p.kursus_id = ?
      ORDER BY p.pertemuan ASC, u.nama ASC, nk.jenis DESC
    `).bind(courseId).all();

    return { success: true, data: results };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal merekap nilai tugas kuis.' });
  }
});