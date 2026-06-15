export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'DB Error' });

  const meetingId = getRouterParam(event, 'meeting_id');

  try {
    // 1. Ambil semua soal untuk pertemuan ini
    const { results: soal } = await env.DB.prepare(`SELECT * FROM kuis_soal WHERE pertemuan_id = ?`).bind(meetingId).all();
    
    if (!soal.length) return { success: true, data: [] };

    // 2. Ambil semua opsi jawaban untuk soal-soal tersebut
    const soalIds = soal.map((s: any) => s.id).join(',');
    const { results: opsi } = await env.DB.prepare(`SELECT * FROM kuis_opsi WHERE soal_id IN (${soalIds})`).all();

    // 3. Gabungkan opsi ke dalam masing-masing soal
    const kuisLengkap = soal.map((s: any) => {
      return {
        ...s,
        opsi: opsi.filter((o: any) => o.soal_id === s.id).map((o: any) => ({
          id: o.id,
          teks: o.teks_opsi,
          is_benar: o.is_benar // Di production, is_benar HARUS disembunyikan dari frontend agar mahasiswa tidak curang (inspect element)
        }))
      };
    });

    return { success: true, data: kuisLengkap };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil soal kuis' });
  }
});