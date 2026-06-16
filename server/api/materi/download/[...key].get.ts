export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  if (!env || !env.BUCKET) throw createError({ statusCode: 500, statusMessage: 'Storage R2 tidak terhubung' });

  // Mengambil seluruh path key setelah /download/ (misal: pertemuan-18/12345-modul.pdf)
  const key = getRouterParam(event, 'key');
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Key file tidak valid' });

  try {
    // Ambil objek file fisik dari R2
    const object = await env.BUCKET.get(key);
    if (!object) throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan di server R2' });

    // Set header browser agar otomatis mengenali ini sebagai PDF atau unduhan resmi
    setHeader(event, 'Content-Type', object.httpMetadata?.contentType || 'application/pdf');
    setHeader(event, 'Content-Disposition', `inline; filename="${key.split('/').pop()}"`);

    // Kembalikan biner file ke browser
    return object.body;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengunduh file' });
  }
});