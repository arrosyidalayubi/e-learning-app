export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database tidak terhubung' });

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const { nama, email, role, password } = body;

  if (!nama || !email || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Nama, Email, dan Role wajib diisi!' });
  }

  try {
    // Jika password diisi baru di-update, jika kosong pertahankan yang lama
    if (password && password.trim() !== '') {
      await env.DB.prepare(`
        UPDATE users SET nama = ?, email = ?, role = ?, password = ? WHERE id = ?
      `).bind(nama, email, role, password, id).run();
    } else {
      await env.DB.prepare(`
        UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?
      `).bind(nama, email, role, id).run();
    }

    return { success: true, message: 'Data pengguna berhasil diperbarui' };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});