import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  
  if (!env || !env.DB || !env.BUCKET) {
    throw createError({ statusCode: 500, statusMessage: 'Infrastruktur tidak terhubung' });
  }

  // ========================================================
  // LAPIS KEAMANAN BARU: VERIFIKASI ROLE DI SISI SERVER
  // ========================================================
  const authUserStr = getCookie(event, 'auth_user');
  if (!authUserStr) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi tidak valid, silakan login ulang.' });
  }

  const authUser = JSON.parse(authUserStr);
  // Tolak mentah-mentah jika role yang mencoba upload adalah mahasiswa atau selain dosen/admin
  if (authUser.role !== 'dosen' && authUser.role !== 'admin') {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Akses Ditolak! Anda tidak memiliki izin untuk mengunggah materi ke server ini.' 
    });
  }
  // ========================================================

  const meetingId = getRouterParam(event, 'meeting_id');
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Tidak ada file' });

  const fileField = formData.find(item => item.name === 'file');
  if (!fileField || !fileField.filename || !fileField.data) {
    throw createError({ statusCode: 400, statusMessage: 'File tidak valid' });
  }

  const namaFile = fileField.filename;
  const mimeType = fileField.type || 'application/pdf';
  const bufferData = fileField.data;
  const ukuranFile = (bufferData.length / (1024 * 1024)).toFixed(2) + ' MB';

  try {
    const objectKey = `pertemuan-${meetingId}/${Date.now()}-${namaFile}`;
    
    // Upload ke R2
    await env.BUCKET.put(objectKey, bufferData, {
      httpMetadata: { contentType: mimeType }
    });

    // Simpan ke D1
    await env.DB.prepare(`
      INSERT INTO pertemuan_materi (pertemuan_id, nama_file, url_file, ukuran_file) 
      VALUES (?, ?, ?, ?)
    `).bind(meetingId, namaFile, objectKey, ukuranFile).run();

    return { success: true, message: 'File aman tersimpan' };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal memproses berkas' });
  }
});