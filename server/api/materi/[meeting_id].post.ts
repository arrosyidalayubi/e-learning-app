import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env;
  
  // Pastikan DB D1 dan Storage R2 (BUCKET) kedua-duanya terhubung
  if (!env || !env.DB || !env.BUCKET) {
    throw createError({ statusCode: 500, statusMessage: 'Infrastruktur Cloudflare (D1/R2) tidak terhubung' });
  }

  const meetingId = getRouterParam(event, 'meeting_id');
  
  // Membaca file fisik yang dikirim dari Frontend Form
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Tidak ada file yang dipilih' });

  // Cari field yang bernama 'file'
  const fileField = formData.find(item => item.name === 'file');
  if (!fileField || !fileField.filename || !fileField.data) {
    throw createError({ statusCode: 400, statusMessage: 'File PDF tidak valid atau rusak' });
  }

  const namaFile = fileField.filename;
  const mimeType = fileField.type || 'application/pdf';
  const bufferData = fileField.data; // Data biner asli file
  const ukuranFile = (bufferData.length / (1024 * 1024)).toFixed(2) + ' MB';

  try {
    // 1. Buat unique path/key di dalam R2 agar file dengan nama sama tidak saling menimpa
    const objectKey = `pertemuan-${meetingId}/${Date.now()}-${namaFile}`;

    // 2. Unggah file biner asli ke Cloudflare R2 Storage
    await env.BUCKET.put(objectKey, bufferData, {
      httpMetadata: { contentType: mimeType }
    });

    // 3. Simpan key path R2 tersebut ke dalam kolom url_file di Database D1
    await env.DB.prepare(`
      INSERT INTO pertemuan_materi (pertemuan_id, nama_file, url_file, ukuran_file) 
      VALUES (?, ?, ?, ?)
    `).bind(meetingId, namaFile, objectKey, ukuranFile).run();

    return { success: true, message: 'File asli berhasil disimpan di Cloudflare R2' };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Gagal menyimpan ke R2' });
  }
});