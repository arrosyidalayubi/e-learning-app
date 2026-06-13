<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard Utama</h1>
        <p class="text-sm text-gray-500 mt-1">Kalender Akademik GENAP 2025/2026</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari mata kuliah..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64 bg-white">
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      
      <NuxtLink 
        v-for="matkul in daftarMataKuliah" 
        :key="matkul.id"
        :to="`/kursus/${matkul.kode}`"
        class="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative h-full"
      >
        <div class="h-1.5 w-full bg-blue-600"></div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-blue-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {{ matkul.nama }}
            </h2>
            <div class="text-xs text-gray-500 mt-1.5 font-medium">
              [{{ matkul.sks }}] {{ matkul.nama }} # {{ matkul.kode }} ({{ matkul.hari }}) [P-1]
            </div>
          </div>

          <div class="mb-6 flex-1">
            <p class="text-xs text-gray-400 mb-0.5">Dosen Pengampu</p>
            <p class="text-sm font-medium text-gray-700 leading-tight">
              {{ matkul.dosen }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex gap-6">
              <div>
                <p class="text-xs text-gray-400">Kode Kelas</p>
                <p class="text-sm font-semibold text-gray-800">{{ matkul.kode }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400">SKS</p>
                <p class="text-sm font-semibold text-gray-800">{{ matkul.sks }}</p>
              </div>
            </div>
            
            <div class="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>
          </div>
        </div>
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
// Simulasi Data Mata Kuliah
const daftarMataKuliah = ref([
  { id: 1, nama: 'SISTEM OPERASI', kode: '02SIFP010', sks: 3, hari: 'Selasa', dosen: 'SALMAN FARIZY S.Kom., M.Kom.' },
  { id: 2, nama: 'PENDIDIKAN PANCASILA', kode: '02SIFP011', sks: 2, hari: 'Senin', dosen: 'Dr. LILI NURLAILI M.Ed.' },
  { id: 3, nama: 'BAHASA INDONESIA', kode: '02SIFP012', sks: 2, hari: 'Jumat', dosen: 'IRAWAN WISNU KUNCORO S.Pd., M.Pd.' },
  { id: 4, nama: 'INTERMEDIATE ACADEMIC ENGLISH', kode: '02SIFP013', sks: 2, hari: 'Selasa', dosen: 'DIYAH IIS ANDRIANI SS, M.Pd' },
  { id: 5, nama: 'ALGORITMA DAN STRUKTUR DATA', kode: '02SIFP014', sks: 3, hari: 'Jumat', dosen: 'MEGA PERMATA SAPANI S.Kom., M.Kom.' },
  { id: 6, nama: 'SISTEM INFORMASI MANAJEMEN', kode: '02SIFP015', sks: 3, hari: 'Selasa', dosen: 'DYAH AYU NURMUMPUNI S.Kom., M.Kom.' },
  { id: 7, nama: 'PERANCANGAN BASIS DATA II', kode: '02SIFP016', sks: 2, hari: 'Selasa', dosen: 'YUDISTI PRAYIGO PERMANA S.Kom., M.Pd.' },
  { id: 8, nama: 'PEMROGRAMAN WEB 2', kode: '02SIFP017', sks: 3, hari: 'Senin', dosen: 'BUDIANTO S.Kom., M.Kom.' }
])
</script>