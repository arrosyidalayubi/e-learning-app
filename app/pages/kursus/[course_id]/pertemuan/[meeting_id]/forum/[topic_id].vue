<template>
  <div class="max-w-4xl mx-auto pb-16">
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink 
        :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/forum`" 
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Daftar Topik
      </NuxtLink>
      <button @click="refresh" class="flex items-center gap-2 py-2 px-4 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        Refresh Data
      </button>
    </div>

    <div v-if="pending" class="py-20 text-center text-blue-600 font-bold animate-pulse">
      Memuat Ruang Diskusi...
    </div>

    <div v-else>
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 relative overflow-hidden">
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
        
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            Pertemuan {{ route.params.meeting_id }} - {{ topikUtama.judul }}
          </h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
            <div class="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {{ topikUtama.dosen ? topikUtama.dosen.substring(0, 2).toUpperCase() : 'DS' }}
              </div>
              <span class="uppercase">{{ topikUtama.dosen }}</span>
            </div>
            <span class="hidden sm:inline text-gray-300">|</span>
            <span class="text-sm text-gray-500">{{ topikUtama.created_at }}</span>
          </div>
        </div>

        <div class="text-gray-700 text-sm md:text-base whitespace-pre-line leading-relaxed bg-blue-50/30 p-5 rounded-xl border border-blue-50">
          {{ topikUtama.deskripsi }}
        </div>
      </div>

      <div class="space-y-6 mb-8">
        <div v-if="dataBalasan.length === 0" class="text-center text-gray-500 py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          Belum ada balasan. Jadilah yang pertama menjawab!
        </div>

        <div v-for="reply in dataBalasan" :key="reply.id" class="flex gap-4">
          <div class="shrink-0 w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm mt-1 uppercase">
            {{ reply.inisial }}
          </div>
          
          <div class="flex-1 bg-white border border-gray-200 rounded-2xl rounded-tl-none p-5 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <span class="font-bold text-gray-900 uppercase">{{ reply.nama }}</span>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                {{ reply.role }}
              </span>
              <span class="text-xs text-gray-500 sm:ml-auto">{{ reply.waktu }}</span>
            </div>
            <div class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {{ reply.pesan }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border-t-4 border-blue-500 rounded-xl shadow-lg p-5">
        <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Tulis Balasan Anda
        </h3>
        <textarea 
          v-model="inputPesan"
          rows="4" 
          placeholder="Ketik jawaban Anda di sini. Hindari plagiasi..."
          class="w-full text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
        ></textarea>
        <div class="mt-4 flex items-center justify-between">
          <p class="text-xs text-gray-500">Gunakan bahasa yang baik dan akademis.</p>
          <button 
            @click="submitBalasan"
            :disabled="!inputPesan.trim() || isLoadingSubmit"
            class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoadingSubmit ? 'Menyimpan...' : 'Kirim ke Forum' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const inputPesan = ref('')
const isLoadingSubmit = ref(false)

// Tarik data dari Database D1
const { data: response, pending, refresh } = await useFetch(`/api/forum/balasan/${route.params.topic_id}`)

const topikUtama = computed(() => response.value?.data?.topik || {})
const dataBalasan = computed(() => response.value?.data?.balasan || [])

// Fungsi kirim ke database
const submitBalasan = async () => {
  if (inputPesan.value.trim() === '') return;
  
  isLoadingSubmit.value = true;
  
  try {
    await $fetch(`/api/forum/balasan/${route.params.topic_id}`, {
      method: 'POST',
      body: { pesan: inputPesan.value }
    });

    inputPesan.value = '';
    
    // Cookie progres untuk buka Kuisioner
    const replyProgress = useCookie(`forum_progress_${route.params.course_id}_${route.params.meeting_id}`)
    replyProgress.value = (replyProgress.value || 0) + 1;
    
    // Tarik ulang data dari DB agar pesan baru muncul
    await refresh();

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);

  } catch (error) {
    alert('Gagal mengirim balasan. Silakan periksa koneksi atau ID Topik.');
  } finally {
    isLoadingSubmit.value = false;
  }
}
</script>

// Mengubah isi file agar hash Vite lolos dari adblocker