<template>
  <div class="max-w-7xl mx-auto">
    <div v-if="pending" class="flex justify-center items-center min-h-[50vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-800">Kursus Tidak Ditemukan</h2>
      <p class="text-gray-500 mt-2">Mata kuliah yang kamu cari mungkin sudah dihapus atau kodenya salah.</p>
      <NuxtLink to="/" class="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
        Kembali ke Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="course">
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <NuxtLink to="/" class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Kembali ke Dashboard
          </NuxtLink>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl uppercase">
          {{ course.nama }} # {{ course.kode_kursus }}
        </h1>
        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span>Dosen: {{ course.dosen }}</span>
          <span>•</span>
          <span>SKS: {{ course.sks }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="modul in course.daftarPertemuan" 
          :key="modul.id"
          class="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-5 border-b border-gray-100 flex justify-between items-start">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Pertemuan {{ modul.pertemuan }}
              </span>
            </div>
            <div v-if="modul.status === 'selesai'" class="text-green-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div v-else-if="modul.status === 'terkunci'" class="text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
          </div>

          <div class="p-5 flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ modul.topik }}
            </h3>
          </div>

          <div class="p-4 bg-gray-50/50 border-t border-gray-100">
            <NuxtLink 
              :to="`/pertemuan/${modul.pertemuan}`"
              class="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
              :class="modul.status === 'terkunci' ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none' : 'bg-blue-600 hover:bg-blue-800 text-white shadow-sm'"
            >
              {{ modul.status === 'terkunci' ? 'Belum Tersedia' : 'Buka Pertemuan' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const courseId = route.params.id

// Memanggil API dinamis kita
const { data: response, pending, error } = await useFetch(`/api/kursus/${courseId}`)

// Mengekstrak data agar mudah digunakan di template
const course = computed(() => response.value?.data)
</script>