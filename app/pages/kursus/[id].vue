<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <NuxtLink to="/" class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Kembali ke Dashboard
        </NuxtLink>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl uppercase">
        {{ courseDetail.nama }} # {{ courseDetail.kode }}
      </h1>
      <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
        <span>Dosen: {{ courseDetail.dosen }}</span>
        <span>•</span>
        <span>SKS: {{ courseDetail.sks }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="modul in dataPertemuan" 
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
</template>

<script setup>
const route = useRoute()
const courseId = route.params.id

// Simulasi database relasional: Mencari detail mata kuliah berdasarkan ID dari URL
const getCourseDetail = (id) => {
  const db_mock = {
    '02SIFP010': { nama: 'Sistem Operasi', kode: id, dosen: 'SALMAN FARIZY S.Kom., M.Kom.', sks: 3 },
    '02SIFP011': { nama: 'Pendidikan Pancasila', kode: id, dosen: 'Dr. LILI NURLAILI M.Ed.', sks: 2 },
    '02SIFP017': { nama: 'Pemrograman Web 2', kode: id, dosen: 'BUDIANTO S.Kom., M.Kom.', sks: 3 }
  }
  return db_mock[id] || { nama: 'Mata Kuliah Tidak Ditemukan', kode: id, dosen: 'Tidak Diketahui', sks: 0 }
}

const courseDetail = getCourseDetail(courseId)

// Data pertemuan yang nanti akan ditarik dari D1 Database
const dataPertemuan = ref([
  { id: 1, pertemuan: 1, topik: `Pengantar ${courseDetail.nama}`, status: 'selesai' },
  { id: 2, pertemuan: 2, topik: `Konsep Dasar ${courseDetail.nama}`, status: 'selesai' },
  { id: 3, pertemuan: 3, topik: 'Studi Kasus & Implementasi', status: 'berlangsung' },
  { id: 4, pertemuan: 4, topik: 'Ujian Tengah Semester', status: 'terkunci' }
])
</script>