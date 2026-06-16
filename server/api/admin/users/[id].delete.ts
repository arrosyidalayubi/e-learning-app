export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) throw createError({ statusCode: 500, statusMessage: 'Database tidak terhubung' });

  const id = getRouterParam(event, 'id');

  try {
    // SQLite akan otomatis menghapus relasi di tabel lain jika ON DELETE CASCADE aktif
    await env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
    return { success: true, message: 'Pengguna berhasil dihapus dari sistem' };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus. User ini kemungkinan memiliki data aktif di kelas.' });
  }
});