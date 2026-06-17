<template>
  <div class="max-w-7xl mx-auto pb-12">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
          <NuxtLink :to="`/kursus/${courseId}`" class="text-blue-600 hover:text-blue-800 transition-colors">
            Kembali ke Peta Kursus
          </NuxtLink>
          <span>/</span>
          <span>Rekap Nilai Tugas</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard Nilai Kuis Harian</h1>
        <p class="text-sm text-gray-500 mt-1">Pemantauan hasil Pre-test dan Post-test mahasiswa (Bobot Tugas 20%)</p>
      </div>
      
      <button 
        @click="exportToCSV"
        :disabled="daftarNilai.length === 0"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Export ke Excel (.CSV)
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Pengerjaan</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ daftarNilai.length }} <span class="text-sm font-medium text-gray-500">Data</span></p>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Nilai Kelas</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ rataRataKelas }} <span class="text-sm font-medium text-gray-500">/ 100</span></p>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Nilai Sempurna (100)</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ nilaiSempurna }} <span class="text-sm font-medium text-gray-500">Mahasiswa</span></p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <h2 class="text-lg font-bold text-gray-900">Rincian Nilai Mahasiswa</h2>
        
        <select v-model="filterPertemuan" class="text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="semua">Semua Pertemuan</option>
          <option v-for="p in listPertemuan" :key="p" :value="p">Pertemuan {{ p }}</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 font-semibold">Mahasiswa</th>
              <th class="px-6 py-4 font-semibold text-center">Pertemuan</th>
              <th class="px-6 py-4 font-semibold">Jenis Kuis</th>
              <th class="px-6 py-4 font-semibold text-center">Skor Akhir</th>
              <th class="px-6 py-4 font-semibold">Waktu Pengerjaan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pending" class="bg-white">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500 animate-pulse">Memuat rekap data...</td>
            </tr>
            <tr v-else-if="filteredNilai.length === 0" class="bg-white">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400">Belum ada data kuis yang dikerjakan mahasiswa.</td>
            </tr>
            <tr v-else v-for="(item, index) in filteredNilai" :key="index" class="hover:bg-blue-50/30 transition-colors bg-white">
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900 uppercase">{{ item.nama_mahasiswa }}</p>
                <p class="text-xs font-mono text-gray-500 mt-0.5">{{ item.nim }}</p>
              </td>
              <td class="px-6 py-4 text-center font-bold text-gray-700">
                Ke-{{ item.pertemuan_ke }}
              </td>
              <td class="px-6 py-4 capitalize">
                <span :class="item.jenis_kuis === 'pre-test' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50'" class="px-2.5 py-1 text-xs font-bold rounded-md">
                  {{ item.jenis_kuis.replace('-', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shadow-sm"
                  :class="[
                    item.nilai >= 80 ? 'bg-green-100 text-green-700 border border-green-200' : '',
                    item.nilai >= 60 && item.nilai < 80 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : '',
                    item.nilai < 60 ? 'bg-red-100 text-red-700 border border-red-200' : ''
                  ]"
                >
                  {{ item.nilai }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 text-xs">
                {{ new Date(item.waktu_pengerjaan).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const courseId = route.params.id

// Proteksi Halaman Khusus Dosen & Admin
const authUser = useCookie<any>('auth_user')
if (authUser.value?.role === 'mahasiswa') {
  navigateTo(`/kursus/${courseId}`)
}

// Fetch Data Nilai
const { data: response, pending } = await useFetch<any>(`/api/dosen/nilai/${courseId}`)
const daftarNilai = computed(() => response.value?.data || [])

// Logika Statistik
const rataRataKelas = computed(() => {
  if (daftarNilai.value.length === 0) return 0
  const total = daftarNilai.value.reduce((acc: number, curr: any) => acc + curr.nilai, 0)
  return Math.round(total / daftarNilai.value.length)
})

const nilaiSempurna = computed(() => {
  return daftarNilai.value.filter((item: any) => item.nilai === 100).length
})

// Logika Filter Pertemuan
const filterPertemuan = ref<string | number>('semua')
const listPertemuan = computed<number[]>(() => {
  const pertemuans = daftarNilai.value.map((item: any) => Number(item.pertemuan_ke))
  return [...new Set(pertemuans)].sort((a: any, b: any) => a - b) as number[]
})

const filteredNilai = computed(() => {
  if (filterPertemuan.value === 'semua') return daftarNilai.value
  return daftarNilai.value.filter((item: any) => item.pertemuan_ke === filterPertemuan.value)
})

// Fungsi Export CSV
const exportToCSV = () => {
  if (filteredNilai.value.length === 0) return

  // Buat Header
  let csvContent = "NIM,Nama Mahasiswa,Pertemuan,Jenis Kuis,Nilai,Waktu Pengerjaan\n"
  
  // Buat Baris Data
  filteredNilai.value.forEach((item: any) => {
    const waktu = new Date(item.waktu_pengerjaan).toLocaleString('id-ID').replace(/,/g, '')
    csvContent += `"${item.nim}","${item.nama_mahasiswa}",${item.pertemuan_ke},${item.jenis_kuis},${item.nilai},"${waktu}"\n`
  })

  // Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `Rekap_Nilai_Kuis_${courseId}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>