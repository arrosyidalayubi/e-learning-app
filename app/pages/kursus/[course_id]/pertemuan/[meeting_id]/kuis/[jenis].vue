<template>
  <div class="max-w-7xl mx-auto pb-16 flex flex-col lg:flex-row gap-6">
    
    <div class="flex-1">
      <div class="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            KEMBALI
          </button>
          <h1 class="text-xl font-bold text-gray-900 capitalize">{{ route.params.jenis.replace('-', ' ') }}</h1>
        </div>
        <div class="px-4 py-2 bg-red-50 text-red-700 font-mono font-bold rounded-lg border border-red-200">
          Waktu Tersisa : {{ formattedTime }}
        </div>
      </div>

      <div v-if="!pending && soalAktif" class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-100 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold text-gray-800">{{ currentSoalIndex + 1 }}.</span>
            <span class="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">Multiple Choice</span>
          </div>
          <span v-if="jawabanUser[soalAktif.id]" class="px-3 py-1 bg-white border border-green-500 text-green-600 text-xs font-bold rounded-full">
            Sudah dijawab
          </span>
        </div>

        <h2 class="text-lg font-bold text-gray-900 mb-4">Sistem Operasi Jaringan</h2>
        <p class="text-gray-800 mb-8 leading-relaxed">{{ soalAktif.pertanyaan }}</p>

        <div class="space-y-4 flex-1">
          <label 
            v-for="(opsi, index) in soalAktif.opsi" 
            :key="opsi.id"
            class="flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200"
            :class="jawabanUser[soalAktif.id] === opsi.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'"
          >
            <input 
              type="radio" 
              :name="`soal_${soalAktif.id}`" 
              :value="opsi.id"
              v-model="jawabanUser[soalAktif.id]"
              class="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            >
            <span class="ml-4 flex items-start gap-3">
              <span class="font-bold text-gray-500">{{ String.fromCharCode(65 + index) }}.</span>
              <span class="text-gray-700">{{ opsi.teks }}</span>
            </span>
          </label>
        </div>

        <div class="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button 
            @click="prevSoal" 
            :disabled="currentSoalIndex === 0"
            class="px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 border transition-colors"
            :class="currentSoalIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-blue-200 text-blue-600 hover:bg-blue-50'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            PREV
          </button>
          
          <button 
            v-if="currentSoalIndex < daftarSoal.length - 1"
            @click="nextSoal" 
            class="px-5 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            NEXT
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>

          <button 
            v-else
            @click="submitKuis"
            class="px-8 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            SELESAI QUIZ
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-80 space-y-6">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 class="font-bold text-gray-900 mb-4">Navigasi Soal</h3>
        <div class="flex flex-wrap gap-3">
          <button 
            v-for="(soal, index) in daftarSoal" 
            :key="soal.id"
            @click="currentSoalIndex = index"
            class="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all"
            :class="[
              jawabanUser[soal.id] ? 'bg-green-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-500',
              currentSoalIndex === index ? 'ring-4 ring-blue-100 border-blue-500 scale-110' : ''
            ]"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 class="font-bold text-gray-900 mb-4">Hint</h3>
        <ul class="space-y-4 text-xs text-gray-600">
          <li class="flex items-start gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500 mt-0.5 shrink-0"></span>
            <span>Warna <strong class="text-blue-500">biru</strong> (garis tepi) menandakan soal sedang dibuka.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-3 h-3 rounded-full bg-green-600 mt-0.5 shrink-0"></span>
            <span>Warna <strong class="text-green-600">hijau</strong> menandakan soal sudah dijawab.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-3 h-3 rounded-full bg-white border-2 border-gray-200 mt-0.5 shrink-0"></span>
            <span>Warna <strong class="text-gray-500">putih</strong> menandakan soal belum dijawab.</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Tarik data soal dari API
const { data: response, pending } = await useFetch(`/api/kuis/${route.params.meeting_id}`)

// Logika Pengacakan (Fisher-Yates Shuffle) untuk Post-Test
const shuffleArray = (array) => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr
}

const daftarSoal = computed(() => {
  let soal = response.value?.data || []
  if (route.params.jenis === 'post-test' && soal.length > 0) {
    soal = shuffleArray(soal) // Acak Urutan Soal
    soal.forEach(s => s.opsi = shuffleArray(s.opsi)) // Acak Urutan Opsi A,B,C,D,E
  }
  return soal
})

// State UI Kuis
const currentSoalIndex = ref(0)
const soalAktif = computed(() => daftarSoal.value[currentSoalIndex.value])
const jawabanUser = ref({}) // Menyimpan format: { id_soal: id_opsi_terpilih }

// Logika Navigasi
const nextSoal = () => { if (currentSoalIndex.value < daftarSoal.value.length - 1) currentSoalIndex.value++ }
const prevSoal = () => { if (currentSoalIndex.value > 0) currentSoalIndex.value-- }

// Logika Timer (5 Menit)
const timeLeft = ref(5 * 60)
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

let timer;
onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      alert('Waktu Habis! Kuis otomatis disubmit.')
      submitKuis()
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))

// Submit Kuis
const submitKuis = () => {
  clearInterval(timer)
  
  // Karena API POST belum dibuat utuh, kita simulasi menyimpan cookie agar centang Peta Pertemuan hijau
  const cookieName = route.params.jenis === 'pre-test' ? `pretest_done_${route.params.course_id}_${route.params.meeting_id}` : `posttest_done_${route.params.course_id}_${route.params.meeting_id}`
  const progressCookie = useCookie(cookieName)
  progressCookie.value = true
  
  router.push(`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}`)
}
</script>