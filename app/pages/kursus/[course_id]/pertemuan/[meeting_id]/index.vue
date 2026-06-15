<template>
  <div class="max-w-4xl mx-auto pb-12">
    <div class="mb-8">
      <NuxtLink 
        :to="`/kursus/${route.params.course_id}`" 
        class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-4"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Daftar Pertemuan
      </NuxtLink>

      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            Pertemuan {{ route.params.meeting_id }}
          </h1>
          <p class="text-gray-500 mt-2">Topik: Mobile Security & Enkripsi Data</p>
        </div>
        
        <div class="text-right">
          <div 
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
            :class="isAllCompleted ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'"
          >
            <svg v-if="isAllCompleted" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ isAllCompleted ? 'Hadir (Selesai)' : 'Dalam Proses (Belum Hadir)' }}
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      
      <div class="bg-white rounded-2xl border transition-all duration-300 flex items-center p-4 sm:p-6 gap-4" :class="isPretestDone ? 'border-green-200 shadow-sm' : 'border-gray-200 shadow-sm'">
        <div class="p-3 rounded-xl" :class="isPretestDone ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">Pre-Test (Kuis Awal)</h3>
            <span v-if="isPretestDone" class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Kerjakan sebelum membuka materi.</p>
        </div>
        
        <NuxtLink 
          v-if="!isPretestDone"
          :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/kuis/pre-test`"
          class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          Mulai Quiz
        </NuxtLink>
        <button 
          v-else
          disabled
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          Selesai ✅
        </button>
      </div>

      <div class="bg-white rounded-2xl border transition-all duration-300 flex items-center p-4 sm:p-6 gap-4" :class="isMateriDone ? 'border-green-200 shadow-sm' : 'border-gray-200 shadow-sm'">
        <div class="p-3 rounded-xl" :class="isMateriDone ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">Materi Pembelajaran</h3>
          <p class="text-sm text-gray-500 mt-1">Modul PDF & Tautan Video Referensi.</p>
        </div>
        <button 
          @click="isMateriDone = true"
          :disabled="isMateriDone"
          class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isMateriDone ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ isMateriDone ? 'Sudah Dibaca ✅' : 'Lihat Materi' }}
        </button>
      </div>

      <div class="bg-white rounded-2xl border transition-all duration-300 flex items-center p-4 sm:p-6 gap-4" :class="isForumDone ? 'border-green-200 shadow-sm' : 'border-gray-200 shadow-sm'">
        <div class="p-3 rounded-xl" :class="isForumDone ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">Forum Diskusi Kelas</h3>
            <span v-if="isForumDone" class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Wajib membalas minimal 2 kali secara total pada topik yang tersedia.
            <span class="font-bold ml-1" :class="isForumDone ? 'text-green-600' : 'text-orange-600'">
              (Progres: {{ replyProgress }}/2)
            </span>
          </p>
        </div>
        <NuxtLink 
          :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/forum`"
          class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="isForumDone ? 'bg-white border border-green-500 text-green-600 hover:bg-green-50' : 'bg-blue-600 hover:bg-blue-700 text-white'"
        >
          Buka Forum Utama
        </NuxtLink>
      </div>

      <div class="bg-white rounded-2xl border transition-all duration-300 flex items-center p-4 sm:p-6 gap-4" :class="isPosttestDone ? 'border-green-200 shadow-sm' : (isForumDone ? 'border-gray-200 shadow-sm' : 'border-gray-100 bg-gray-50 opacity-75')">
        <div class="p-3 rounded-xl" :class="isPosttestDone ? 'bg-green-50 text-green-600' : (isForumDone ? 'bg-purple-50 text-purple-600' : 'bg-gray-200 text-gray-400')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold" :class="isForumDone ? 'text-gray-900' : 'text-gray-500'">Post-Test (Kuis Akhir)</h3>
            <span v-if="isPosttestDone" class="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>
          </div>
          <p class="text-sm mt-1" :class="isForumDone ? 'text-gray-500' : 'text-red-400'">
            {{ isForumDone ? 'Kerjakan untuk mengevaluasi pemahaman materi.' : 'Terkunci. Selesaikan Forum Diskusi terlebih dahulu.' }}
          </p>
        </div>
        
        <NuxtLink 
          v-if="isForumDone && !isPosttestDone"
          :to="`/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/kuis/post-test`"
          class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
        >
          Mulai Quiz
        </NuxtLink>
        <button 
          v-else
          disabled
          class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isPosttestDone ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        >
          <span v-if="!isForumDone">🔒 Terkunci</span>
          <span v-else>Selesai ✅</span>
        </button>
      </div>

      <div 
        class="rounded-2xl border-2 transition-all duration-500 flex items-center p-4 sm:p-6 gap-4" 
        :class="[
          !isPosttestDone ? 'border-gray-100 bg-gray-50 opacity-75' : '',
          isPosttestDone && !isKuisionerDone ? 'border-blue-400 shadow-lg shadow-blue-100 bg-blue-50/50' : '',
          isKuisionerDone ? 'border-green-500 bg-green-50 shadow-md' : ''
        ]"
      >
        <div class="p-3 rounded-xl" :class="isKuisionerDone ? 'bg-green-500 text-white shadow-inner' : (isPosttestDone ? 'bg-blue-500 text-white animate-bounce' : 'bg-gray-200 text-gray-400')">
          <svg v-if="isKuisionerDone" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold" :class="isKuisionerDone ? 'text-green-800' : (isPosttestDone ? 'text-blue-900' : 'text-gray-500')">
            Kuisioner Dosen
          </h3>
          <p class="text-sm mt-1" :class="isKuisionerDone ? 'text-green-700 font-medium' : (isPosttestDone ? 'text-blue-700' : 'text-gray-400')">
            {{ isKuisionerDone ? 'Terima kasih, kuisioner telah tersimpan di sistem.' : (isPosttestDone ? 'Wajib diisi sebagai syarat kehadiran akhir.' : 'Terkunci. Selesaikan Post-Test terlebih dahulu.') }}
          </p>
        </div>
        
        <NuxtLink 
          :to="isPosttestDone && !isKuisionerDone ? `/kursus/${route.params.course_id}/pertemuan/${route.params.meeting_id}/kuisioner` : ''"
          class="px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 text-center"
          :class="[
            !isPosttestDone ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' : '',
            isPosttestDone && !isKuisionerDone ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-300 transform hover:-translate-y-0.5' : '',
            isKuisionerDone ? 'bg-green-600 text-white cursor-not-allowed pointer-events-none ring-4 ring-green-200' : ''
          ]"
        >
          <span v-if="!isPosttestDone">🔒 Terkunci</span>
          <span v-else-if="isKuisionerDone">Telah Disubmit ✅</span>
          <span v-else>Isi Kuisioner Sekarang</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// 1. Tarik status dari cookie agar state-nya persisten (tidak hilang saat pindah halaman)
const isPretestDone = useCookie(`pretest_done_${route.params.course_id}_${route.params.meeting_id}`, { default: () => false })
const isMateriDone = useCookie(`materi_done_${route.params.course_id}_${route.params.meeting_id}`, { default: () => false })
const replyProgress = useCookie(`forum_progress_${route.params.course_id}_${route.params.meeting_id}`, { default: () => 0 })
const isPosttestDone = useCookie(`posttest_done_${route.params.course_id}_${route.params.meeting_id}`, { default: () => false })
const isKuisionerDone = useCookie(`kuisioner_done_${route.params.course_id}_${route.params.meeting_id}`, { default: () => false })

// 2. Logika Forum & Kehadiran
const isForumDone = computed(() => replyProgress.value >= 2)

const isAllCompleted = computed(() => {
  return isPretestDone.value && isMateriDone.value && isForumDone.value && isPosttestDone.value && isKuisionerDone.value
})
</script>