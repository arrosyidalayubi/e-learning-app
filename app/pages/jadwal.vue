<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Jadwal Kuliah</h1>
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th class="p-4 font-semibold">Hari & Waktu</th>
              <th class="p-4 font-semibold">Mata Kuliah</th>
              <th class="p-4 font-semibold">Ruang</th>
              <th class="p-4 font-semibold">Dosen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="jadwal in jadwalKuliah" :key="jadwal.id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ jadwal.hari }}</div>
                <div class="text-xs text-gray-500">{{ jadwal.waktu }}</div>
              </td>
              <td class="p-4">
                <div class="font-medium text-blue-600">{{ jadwal.matkul }}</div>
                <div class="text-xs text-gray-500">SKS: {{ jadwal.sks }} | Kelas: {{ jadwal.kelas }}</div>
              </td>
              <td class="p-4 whitespace-nowrap">{{ jadwal.ruang }}</td>
              <td class="p-4">{{ jadwal.dosen }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const jadwalKuliah = [
  { id: 1, hari: 'Senin', waktu: '08:00 - 10:30', matkul: 'Pemrograman Web 2', sks: 3, kelas: '02SIFP010', ruang: 'Lab Komputer A', dosen: 'Budianto S.Kom., M.Kom.' },
  { id: 2, hari: 'Selasa', waktu: '10:00 - 12:30', matkul: 'Sistem Operasi', sks: 3, kelas: '02SIFP010', ruang: 'Ruang V.102', dosen: 'Salman Farizy S.Kom., M.Kom.' },
  { id: 3, hari: 'Selasa', waktu: '13:00 - 14:40', matkul: 'Intermediate Academic English', sks: 2, kelas: '02SIFP010', ruang: 'Ruang V.103', dosen: 'Diyah Iis Andriani SS, M.Pd' },
  { id: 4, hari: 'Jumat', waktu: '08:00 - 09:40', matkul: 'Bahasa Indonesia', sks: 2, kelas: '02SIFP010', ruang: 'Ruang V.105', dosen: 'Irawan Wisnu Kuncoro S.Pd., M.Pd.' },
]
</script>