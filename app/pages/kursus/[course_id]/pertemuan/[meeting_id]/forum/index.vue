<template>
  <div class="max-w-5xl mx-auto pb-12">
    <div class="mb-8">
      <NuxtLink 
        :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}`" 
        class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-4"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Peta Pertemuan {{ route.params.meeting_id }}
      </NuxtLink>

      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
        Forum Diskusi - Pertemuan {{ route.params.meeting_id }}
      </h1>
      <p class="text-gray-500 mt-2">Pilih topik di bawah ini untuk memulai diskusi dengan dosen dan rekan mahasiswa.</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="p-10 text-center text-blue-500 animate-pulse font-medium">
        Memuat topik diskusi...
      </div>
      
      <div v-else-if="daftarTopik.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800">Belum Ada Topik Diskusi</h3>
        <p class="text-gray-500 mt-1">Dosen belum membuat topik untuk pertemuan ini.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 font-semibold w-2/3">Topik Diskusi</th>
              <th class="px-6 py-4 font-semibold text-center">Jumlah Balasan</th>
              <th class="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="topik in daftarTopik" :key="topik.id" class="hover:bg-blue-50/50 transition-colors group">
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900 text-base mb-1">{{ topik.judul }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-700">Oleh: {{ topik.dosen }}</span>
                  <span>•</span>
                  <span>Dibuat: {{ topik.waktu }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center min-w-8 h-8 px-3 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {{ topik.totalBalasan }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <NuxtLink 
                  :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/forum/${topik.id}`"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
                >
                  Masuk Diskusi
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// Panggil API untuk mendapatkan daftar topik dari database
const { data: response, pending } = await useFetch(`/api/forum/topik/${route.params.meeting_id}`)

// Ekstrak data topik
const daftarTopik = computed(() => response.value?.data || [])
</script>