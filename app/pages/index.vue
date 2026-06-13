<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
        [3] SISTEM OPERASI # 02SIFP010 (Selasa) [P-1]
      </h1>
      <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
        <span>Dosen: Salman Farizy S.Kom., M.Kom.</span>
        <span>•</span>
        <span>Semester Genap 2025/2026</span>
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
            <p class="text-xs text-gray-500">{{ modul.tanggal }}</p>
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
          
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>{{ modul.jumlahMateri }} Materi Pembelajaran</span>
            </div>
            <div v-if="modul.adaForum" class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
              <span>Forum Diskusi Aktif</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50/50 border-t border-gray-100">
          <NuxtLink 
            :to="`/pertemuan/${modul.pertemuan}`"
            class="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
            :class="modul.status === 'terkunci' 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none' 
              : 'bg-primary-600 hover:bg-blue-800 text-white shadow-sm'"
          >
            {{ modul.status === 'terkunci' ? 'Belum Tersedia' : 'Buka Pertemuan' }}
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Mock data lengkap untuk mensimulasikan database riil
const dataPertemuan = ref([
  { id: 101, pertemuan: 1, tanggal: '02 Mar 2026', topik: 'Kontrak Kuliah & Pengantar Sistem Operasi', status: 'selesai', jumlahMateri: 2, adaForum: true },
  { id: 102, pertemuan: 2, tanggal: '09 Mar 2026', topik: 'Struktur Sistem Komputer & Arsitektur', status: 'selesai', jumlahMateri: 3, adaForum: true },
  { id: 103, pertemuan: 3, tanggal: '16 Mar 2026', topik: 'Struktur Sistem Operasi (Monolithic vs Microkernel)', status: 'selesai', jumlahMateri: 2, adaForum: false },
  { id: 104, pertemuan: 4, tanggal: '23 Mar 2026', topik: 'Manajemen Proses & Threading', status: 'berlangsung', jumlahMateri: 4, adaForum: true },
  { id: 105, pertemuan: 5, tanggal: '30 Mar 2026', topik: 'Penjadwalan CPU (CPU Scheduling)', status: 'terkunci', jumlahMateri: 2, adaForum: false },
  { id: 106, pertemuan: 6, tanggal: '06 Apr 2026', topik: 'Sinkronisasi Proses & Deadlocks', status: 'terkunci', jumlahMateri: 3, adaForum: true },
  { id: 107, pertemuan: 7, tanggal: '13 Apr 2026', topik: 'Manajemen Memori Utama (Main Memory)', status: 'terkunci', jumlahMateri: 2, adaForum: false },
  { id: 108, pertemuan: 8, tanggal: '20 Apr 2026', topik: 'Ujian Tengah Semester (UTS)', status: 'terkunci', jumlahMateri: 1, adaForum: false },
  // ... data dilanjutkan hingga pertemuan 20
])
</script>