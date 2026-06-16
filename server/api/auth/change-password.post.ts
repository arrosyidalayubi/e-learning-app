export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database tidak terhubung' });

  // Baca sesi user dari cookie
  const authUserStr = getCookie(event, 'auth_user');
  if (!authUserStr) throw createError({ statusCode: 401, statusMessage: 'Sesi habis' });
  const authUser = JSON.parse(authUserStr);

  const body = await readBody(event);
  const { password_lama, password_baru } = body;

  if (!password_lama || !password_baru) {
    throw createError({ statusCode: 400, statusMessage: 'Semua kolom wajib diisi!' });
  }

  if (password_baru.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password baru minimal harus 6 karakter!' });
  }

  try {
    // 1. Validasi apakah password lama yang dimasukkan sudah cocok dengan di database
    const user = await env.DB.prepare(`SELECT id FROM users WHERE id = ? AND password = ?`)
      .bind(authUser.id, password_lama)
      .first();

    if (!user) {
      throw createError({ statusCode: 400, statusMessage: 'Kata sandi lama yang Anda masukkan salah!' });
    }

    // 2. Update password baru ke tabel users
    await env.DB.prepare(`UPDATE users SET password = ? WHERE id = ?`)
      .bind(password_baru, authUser.id)
      .run();

    return { success: true, message: 'Kata sandi akun Anda berhasil diperbarui!' };
  } catch (error: any) {
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Gagal mengubah kata sandi' 
    });
  }
});