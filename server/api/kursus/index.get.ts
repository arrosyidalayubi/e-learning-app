export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  
  if (!env || !env.DB) {
    throw createError({ statusCode: 500, statusMessage: 'Database D1 tidak terhubung.' });
  }

  try {
    // JOIN tabel kursus dan users untuk mendapatkan nama dosen secara langsung
    const query = `
      SELECT 
        k.kode_kursus, 
        k.nama, 
        k.sks, 
        k.hari, 
        u.nama as dosen 
      FROM kursus k
      JOIN users u ON k.dosen_id = u.id
    `;
    
    const { results } = await env.DB.prepare(query).all();

    return {
      success: true,
      data: results
    };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});