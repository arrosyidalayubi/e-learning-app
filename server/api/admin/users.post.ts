export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung' });

  const body = await readBody(event);
  const { id, nama, email, role } = body;

  // Validasi dasar
  if (!id || !nama || !email || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Semua kolom wajib diisi!' });
  }

  try {
    // Insert data ke tabel users di D1
    await env.DB.prepare(`
      INSERT INTO users (id, nama, email, role) 
      VALUES (?, ?, ?, ?)
    `).bind(id, nama, email, role).run();

    return { success: true, message: `Berhasil menambahkan ${role}: ${nama}` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan.';
    // Error biasanya terjadi jika ID (NIM/NIDN) atau Email sudah ada (UNIQUE constraint)
    throw createError({ statusCode: 409, statusMessage: 'ID atau Email mungkin sudah terdaftar di sistem.' });
  }
});