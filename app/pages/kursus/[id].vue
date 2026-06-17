<template>
  <div class="max-w-7xl mx-auto pb-12">
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

        <div v-if="authUser?.role === 'dosen' || authUser?.role === 'admin'" class="shrink-0">
          <NuxtLink 
            :to="`/kursus/${courseId}/rekap-nilai`"
            class="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Lihat Rekap Nilai Kuis
          </NuxtLink>
        </div>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="modul in course.daftarPertemuan" 
          :key="modul.id"
          :id="`pertemuan-${modul.pertemuan}`"
          class="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border bg-white"
          :class="[
            isMeetingCompleted(modul.pertemuan) ? 'border-green-300 bg-green-50/10' : (lastActiveMeeting === modul.pertemuan ? 'border-blue-500 shadow-xl scale-[1.02] ring-4 ring-blue-50' : 'border-gray-200 hover:shadow-lg hover:border-blue-300')
          ]"
        >
          <div class="p-5 border-b flex justify-between items-start transition-colors" :class="isMeetingCompleted(modul.pertemuan) ? 'border-green-100 bg-green-50' : (lastActiveMeeting === modul.pertemuan ? 'border-blue-500 bg-blue-50' : 'border-gray-100')">
            <div>
              <span 
                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 transition-colors"
                :class="isMeetingCompleted(modul.pertemuan) ? 'bg-green-600 text-white' : (lastActiveMeeting === modul.pertemuan ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')"
              >
                Pertemuan {{ modul.pertemuan }}
              </span>
            </div>
            
            <div v-if="isMeetingCompleted(modul.pertemuan)" class="text-green-500 flex items-center gap-1 text-xs font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div v-else :class="lastActiveMeeting === modul.pertemuan ? 'text-blue-600' : 'text-gray-400'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0-3.332.477-4.5 1.253"/></svg>
            </div>
          </div>

          <div class="p-5 flex-1 transition-colors" :class="!isMeetingCompleted(modul.pertemuan) && lastActiveMeeting === modul.pertemuan ? 'bg-blue-600 text-white' : 'text-gray-900'">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2">
              {{ modul.topik }}
            </h3>
            <div v-if="!isMeetingCompleted(modul.pertemuan) && lastActiveMeeting === modul.pertemuan" class="text-sm text-blue-200 mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Terakhir diakses
            </div>
          </div>

          <div class="p-4 border-t transition-colors" :class="isMeetingCompleted(modul.pertemuan) ? 'bg-green-50/50 border-green-100' : (lastActiveMeeting === modul.pertemuan ? 'bg-blue-700 border-blue-500' : 'bg-gray-50/50 border-gray-100')">
            <NuxtLink 
              :to="`/kursus/${courseId}/pertemuan/${modul.pertemuan}`"
              @click="setLastActive(modul.pertemuan)"
              class="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold transition-colors shadow-sm"
              :class="[
                isMeetingCompleted(modul.pertemuan) ? 'bg-white border border-green-500 text-green-600 hover:bg-green-50' : '',
                !isMeetingCompleted(modul.pertemuan) && lastActiveMeeting === modul.pertemuan ? 'bg-white text-blue-700 hover:bg-gray-100' : '',
                !isMeetingCompleted(modul.pertemuan) && lastActiveMeeting !== modul.pertemuan ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
              ]"
            >
              {{ isMeetingCompleted(modul.pertemuan) ? 'Review Pertemuan' : (lastActiveMeeting === modul.pertemuan ? 'Lanjutkan Belajar' : 'Buka Pertemuan') }}
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
const authUser = useCookie('auth_user')

// Fetch Data API
const { data: response, pending, error } = await useFetch(`/api/kursus/${courseId}`)
const course = computed(() => response.value?.data)

// State Persistence Last Active
const lastActiveCookie = useCookie(`last_active_${courseId}`, { maxAge: 60 * 60 * 24 * 7 })
const lastActiveMeeting = ref(lastActiveCookie.value || null)

const setLastActive = (pertemuanId) => {
  lastActiveMeeting.value = pertemuanId
  lastActiveCookie.value = pertemuanId
}

// FUNGSI BARU: Mengecek apakah pertemuan ke-N sudah selesai semua (100%)
const isMeetingCompleted = (meetingNum) => {
  const pretest = useCookie(`pretest_done_${courseId}_${meetingNum}`).value
  const materi = useCookie(`materi_done_${courseId}_${meetingNum}`).value
  const forum = useCookie(`forum_progress_${courseId}_${meetingNum}`).value
  const posttest = useCookie(`posttest_done_${courseId}_${meetingNum}`).value
  const kuisioner = useCookie(`kuisioner_done_${courseId}_${meetingNum}`).value
  
  return pretest && materi && (forum >= 2) && posttest && kuisioner
}

// Auto-Scroll Feature
onMounted(() => {
  if (lastActiveMeeting.value) {
    setTimeout(() => {
      const activeElement = document.getElementById(`pertemuan-${lastActiveMeeting.value}`)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300)
  }
})
</script>