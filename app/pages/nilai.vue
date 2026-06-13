<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Transkrip Nilai</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div class="bg-blue-600 text-white p-6 rounded-2xl shadow-sm">
        <p class="text-blue-100 text-sm font-medium">Indeks Prestasi Kumulatif (IPK)</p>
        <p class="text-3xl font-bold mt-1">3.85</p>
      </div>
      <div class="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <p class="text-gray-500 text-sm font-medium">Total SKS Lulus</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">45</p>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th class="p-4 font-semibold">Kode</th>
              <th class="p-4 font-semibold">Mata Kuliah</th>
              <th class="p-4 font-semibold text-center">SKS</th>
              <th class="p-4 font-semibold text-center">Nilai Huruf</th>
              <th class="p-4 font-semibold text-center">Bobot</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="nilai in transkrip" :key="nilai.kode" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 font-mono text-xs text-gray-500">{{ nilai.kode }}</td>
              <td class="p-4 font-medium text-gray-900">{{ nilai.matkul }}</td>
              <td class="p-4 text-center">{{ nilai.sks }}</td>
              <td class="p-4 text-center font-bold" :class="nilai.huruf === 'A' ? 'text-green-600' : (nilai.huruf === 'B' ? 'text-blue-600' : 'text-yellow-600')">
                {{ nilai.huruf }}
              </td>
              <td class="p-4 text-center">{{ nilai.bobot }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const transkrip = [
  { kode: 'TIS0011', matkul: 'Algoritma dan Struktur Data', sks: 3, huruf: 'A', bobot: 12 },
  { kode: 'TIS0012', matkul: 'Perancangan Basis Data II', sks: 2, huruf: 'A', bobot: 8 },
  { kode: 'TIS0013', matkul: 'Sistem Informasi Manajemen', sks: 3, huruf: 'B', bobot: 9 },
  { kode: 'TIS0014', matkul: 'Pendidikan Pancasila', sks: 2, huruf: 'A', bobot: 8 },
  { kode: 'TIS0015', matkul: 'Arsitektur Komputer', sks: 3, huruf: 'A', bobot: 12 },
]
</script>