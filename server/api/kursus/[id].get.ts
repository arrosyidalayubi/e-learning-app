export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  
  if (!env || !env.DB) {
    throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung.' });
  }

  // Menangkap parameter dinamis [id] dari URL
  const kodeKursus = getRouterParam(event, 'id');

  try {
    // 1. Ambil detail kursus dan nama dosen
    const detailQuery = `
      SELECT k.kode_kursus, k.nama, k.sks, k.hari, u.nama as dosen 
      FROM kursus k
      JOIN users u ON k.dosen_id = u.id
      WHERE k.kode_kursus = ?
    `;
    const detailKursus = await env.DB.prepare(detailQuery).bind(kodeKursus).first();

    if (!detailKursus) {
      throw createError({ statusCode: 404, statusMessage: 'Mata kuliah tidak ditemukan.' });
    }

    // 2. Ambil seluruh daftar pertemuan untuk kursus tersebut
    const pertemuanQuery = `
      SELECT id, nomor_pertemuan as pertemuan, topik, status 
      FROM pertemuan 
      WHERE kode_kursus = ? 
      ORDER BY nomor_pertemuan ASC
    `;
    const { results: daftarPertemuan } = await env.DB.prepare(pertemuanQuery).bind(kodeKursus).all();

    // 3. Gabungkan hasilnya
    return {
      success: true,
      data: {
        ...detailKursus,
        daftarPertemuan
      }
    };

  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});