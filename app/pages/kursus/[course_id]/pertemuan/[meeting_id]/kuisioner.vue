<template>
  <div class="max-w-4xl mx-auto pb-16">
    <!-- Breadcrumb Navigasi -->
    <div class="mb-8">
      <NuxtLink 
        :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}`" 
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Peta Pertemuan
      </NuxtLink>

      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
        Kuisioner Evaluasi Dosen
      </h1>
      <p class="text-gray-500 mt-2">Pertemuan {{ route.params.meeting_id }} • SALMAN FARIZY S.Kom, M. Kom</p>
    </div>

    <!-- Tampilan Jika Sudah Disubmit (Success State) -->
    <div v-if="isSubmitted" class="bg-white rounded-2xl border border-green-200 shadow-lg p-10 text-center transform transition-all duration-500">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Penilaian Anda telah berhasil disimpan di sistem. Evaluasi ini sangat berarti untuk meningkatkan kualitas pembelajaran di masa depan.
      </p>
      <NuxtLink 
        :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}`"
        class="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors"
      >
        Kembali ke Peta Belajar
      </NuxtLink>
    </div>

    <!-- Tampilan Form Kuisioner (Jika belum submit) -->
    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <div class="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <svg class="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-sm text-blue-800">
          Silakan jawab pernyataan berikut dengan jujur dan objektif. Data Anda dijamin kerahasiaannya dan tidak akan mempengaruhi nilai akademik. Semua pertanyaan <strong>wajib</strong> diisi.
        </p>
      </div>

      <!-- List Pertanyaan -->
      <div class="space-y-8 mt-8">
        <div 
          v-for="(soal, index) in daftarSoal" 
          :key="soal.id"
          class="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
        >
          <div class="flex gap-4">
            <!-- Nomor Soal -->
            <div class="shrink-0 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
              {{ index + 1 }}
            </div>
            
            <div class="flex-1">
              <p class="text-gray-800 font-medium leading-relaxed mb-4">
                {{ soal.pertanyaan }}
              </p>
              
              <!-- Custom Radio Buttons (Cards) -->
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Opsi YA -->
                <label 
                  class="flex-1 relative flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                  :class="jawaban[soal.id] === 'ya' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 bg-white'"
                >
                  <input 
                    type="radio" 
                    :name="`soal_${soal.id}`" 
                    value="ya" 
                    v-model="jawaban[soal.id]"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  >
                  <span class="ml-3 font-semibold" :class="jawaban[soal.id] === 'ya' ? 'text-blue-800' : 'text-gray-700'">
                    Ya
                  </span>
                </label>

                <!-- Opsi TIDAK -->
                <label 
                  class="flex-1 relative flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                  :class="jawaban[soal.id] === 'tidak' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 hover:border-red-300 bg-white'"
                >
                  <input 
                    type="radio" 
                    :name="`soal_${soal.id}`" 
                    value="tidak" 
                    v-model="jawaban[soal.id]"
                    class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  >
                  <span class="ml-3 font-semibold" :class="jawaban[soal.id] === 'tidak' ? 'text-red-800' : 'text-gray-700'">
                    Tidak
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Area Submit -->
      <div class="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm">
          Progres: <span class="font-bold" :class="totalTerjawab === daftarSoal.length ? 'text-green-600' : 'text-orange-600'">{{ totalTerjawab }} / {{ daftarSoal.length }}</span> Terjawab
        </div>
        
        <button 
          @click="submitKuisioner"
          :disabled="!isSemuaTerjawab || isLoading"
          class="w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          :class="[
            !isSemuaTerjawab ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : '',
            isSemuaTerjawab && !isLoading ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5' : '',
            isLoading ? 'bg-blue-400 text-white cursor-wait' : ''
          ]"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoading ? 'Menyimpan...' : 'Submit Kuisioner' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const kuisionerProgress = useCookie(`kuisioner_done_${route.params.course_id}_${route.params.meeting_id}`)

// State UI
const isLoading = ref(false)
const isSubmitted = ref(false)

// State untuk menampung jawaban user (Format: { q1: 'ya', q2: 'tidak' })
const jawaban = ref({})

// Data Soal (Diadaptasi dari screenshot UNPAM aslinya)
const daftarSoal = ref([
  { id: 'q1', pertanyaan: 'Dosen melaksanakan perkuliahan secara daring sesuai jadwal yang ditentukan pada kalender akademik.' },
  { id: 'q2', pertanyaan: 'Dosen menggunakan Learning Management System (LMS) Unpam dalam perkuliahan daring.' },
  { id: 'q3', pertanyaan: 'Dosen mengarahkan mahasiswa untuk mempelajari bahan ajar yang telah diunggah di LMS Unpam baik buku ajar maupun video pembelajaran.' },
  { id: 'q4', pertanyaan: 'Dosen mengunggah hasil penelitian dosen Unpam di LMS sebagai tambahan materi perkuliahan daring.' },
  { id: 'q5', pertanyaan: 'Dosen memberikan topik diskusi yang berorientasi pada pemecahan masalah saat perkuliahan daring, sehingga mendorong mahasiswa berpikir kreatif, inovatif, dan kritis.' },
  { id: 'q6', pertanyaan: 'Dosen melihat kehadiran mahasiswa pada pembelajaran daring melalui aktifitas di LMS Unpam mulai dari mengerjakan tes awal hingga tes akhir.' }
])

// Computed Properties untuk Validasi Real-time
const totalTerjawab = computed(() => Object.keys(jawaban.value).length)
const isSemuaTerjawab = computed(() => totalTerjawab.value === daftarSoal.value.length)

// Fungsi Simulasi Submit ke Database
// Fungsi Simulasi Submit ke Database
const submitKuisioner = () => {
  if (isSemuaTerjawab.value) {
    isLoading.value = true
    
    setTimeout(() => {
      isLoading.value = false
      isSubmitted.value = true
      
      // TAMBAHAN KRUSIAL: Set cookie menjadi true
      kuisionerProgress.value = true
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }
}
</script>