export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung' });

  const body = await readBody(event);
  const { id, nama, email, role, password } = body;

  // Validasi dasar field utama
  if (!id || !nama || !email || !role) {
    throw createError({ statusCode: 400, statusMessage: 'ID, Nama, Email, dan Role wajib diisi!' });
  }

  // Jika password diisi gunakan inputan, jika kosong otomatis beri default '123456'
  const finalPassword = password && password.trim() !== '' ? password : '123456';

  try {
    // Masukkan password ke dalam statement query SQL
    await env.DB.prepare(`
      INSERT INTO users (id, nama, email, role, password) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, nama, email, role, finalPassword).run();

    return { success: true, message: `Berhasil menambahkan ${role}: ${nama}` };
  } catch (error) {
    throw createError({ statusCode: 409, statusMessage: 'ID atau Email mungkin sudah terdaftar di sistem.' });
  }
});