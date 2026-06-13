<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <NuxtLink to="/" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Kembali
          </NuxtLink>
          <span class="text-gray-300">|</span>
          <h1 class="text-xl font-bold text-gray-900">Pretest Pertemuan {{ route.params.id }}</h1>
        </div>
        <p class="text-sm text-gray-500">Sistem Operasi Jaringan</p>
      </div>
      
      <div class="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-mono text-sm border border-red-100 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Waktu tersisa : 14:59
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
        <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <span class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Soal No. 1</span>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">Sudah dijawab</span>
        </div>

        <div class="prose max-w-none text-gray-800">
          <p class="text-lg font-medium leading-relaxed mb-6">
            Apa peran krusial dari <em>Domain Name System</em> (DNS) dalam arsitektur jaringan komputer modern?
          </p>
          
          <div class="space-y-3 mt-4">
            <label v-for="(opsi, index) in pilihanJawaban" :key="index" 
              class="flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors"
              :class="jawabanTerpilih === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <input 
                type="radio" 
                name="soal_1" 
                :value="index" 
                v-model="jawabanTerpilih"
                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              >
              <span class="text-gray-700 leading-tight">
                <span class="font-semibold mr-2">{{ String.fromCharCode(65 + index) }}.</span>
                {{ opsi }}
              </span>
            </label>
          </div>
        </div>

        <div class="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
          <button class="px-5 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
            &larr; Sebelumnya
          </button>
          <button class="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
            Selanjutnya &rarr;
          </button>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 class="font-bold text-gray-900 mb-4">Navigasi Soal</h3>
          <div class="grid grid-cols-5 gap-2">
            <button v-for="n in 15" :key="n" 
              class="w-full aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-colors"
              :class="{
                'bg-green-500 text-white border border-green-600 shadow-inner': n <= 5, // Simulasi sudah dijawab
                'bg-blue-600 text-white border border-blue-700 ring-2 ring-blue-300 ring-offset-1': n === 1, // Simulasi sedang aktif
                'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50': n > 5 // Simulasi belum dijawab
              }"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div class="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-sm space-y-3">
          <h4 class="font-semibold text-gray-700 mb-2">Keterangan</h4>
          <div class="flex items-center gap-2 text-gray-600">
            <div class="w-4 h-4 rounded bg-green-500"></div> <span>Sudah dijawab</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <div class="w-4 h-4 rounded bg-white border border-gray-300"></div> <span>Belum dijawab</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <div class="w-4 h-4 rounded bg-blue-600"></div> <span>Posisi saat ini</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// Data statis untuk keperluan UI
const jawabanTerpilih = ref(4) // Simulasi jawaban 'E' sudah terpilih
const pilihanJawaban = ref([
  'Mengelola proses multitasking dalam sistem operasi jaringan.',
  'Melindungi jaringan dari serangan Denial of Service (DoS).',
  'Mengalokasikan bandwidth di jaringan berdasarkan prioritas pengguna.',
  'Mengelola alamat IP dinamis untuk setiap perangkat di jaringan.',
  'Mengonversi nama domain ke alamat IP yang dapat digunakan oleh perangkat jaringan.'
])
</script>