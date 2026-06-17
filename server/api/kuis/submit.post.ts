export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database tidak terhubung' });

  // 1. Ambil identitas mahasiswa dari session cookie
  const authUserStr = getCookie(event, 'auth_user');
  if (!authUserStr) throw createError({ statusCode: 401, statusMessage: 'Sesi habis, silakan login kembali.' });
  const authUser = JSON.parse(authUserStr);

  const body = await readBody(event);
  const { pertemuan_id, jenis, jawaban } = body; // 'jawaban' berformat: { soal_id: opsi_id }

  if (!pertemuan_id || !jenis || !jawaban) {
    throw createError({ statusCode: 400, statusMessage: 'Payload data kuis tidak lengkap.' });
  }

  try {
    // 2. Ambil semua kunci jawaban yang benar dari kuis_opsi untuk pertemuan ini
    const { results: kunciJawaban } = await env.DB.prepare(`
      SELECT o.id as opsi_id, o.soal_id 
      FROM kuis_opsi o
      JOIN kuis_soal s ON o.soal_id = s.id
      WHERE s.pertemuan_id = ? AND o.is_benar = 1
    `).bind(pertemuan_id).all();

    if (!kunciJawaban.length) {
      throw createError({ statusCode: 404, statusMessage: 'Bank soal untuk pertemuan ini belum dikonfigurasi.' });
    }

    // 3. Kalkulasi jawaban benar
    let jumlahBenar = 0;
    kunciJawaban.forEach((kunci: any) => {
      const jawabanMahasiswa = jawaban[kunci.soal_id];
      if (jawabanMahasiswa && Number(jawabanMahasiswa) === Number(kunci.opsi_id)) {
        jumlahBenar++;
      }
    });

    // Hitung nilai akhir skala 100
    const nilaiAkhir = Math.round((jumlahBenar / kunciJawaban.length) * 100);

    // 4. Simpan atau timpa nilai ke dalam database D1
    await env.DB.prepare(`
      INSERT INTO nilai_kuis (user_id, pertemuan_id, jenis, nilai) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, pertemuan_id, jenis) DO UPDATE SET 
        nilai = excluded.nilai,
        created_at = CURRENT_TIMESTAMP
    `).bind(authUser.id, pertemuan_id, jenis, nilaiAkhir).run();

    return { 
      success: true, 
      nilai: nilaiAkhir, 
      message: `Kuis berhasil dikirim. Skor Anda: ${nilaiAkhir}` 
    };
  } catch (error: any) {
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Gagal memproses penilaian kuis.' 
    });
  }
});