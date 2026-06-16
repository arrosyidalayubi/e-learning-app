<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
      
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">Mentari V2</h2>
        <p class="mt-2 text-sm text-gray-500">Silakan masuk dengan NIM/NIDN Anda</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Pengguna (NIM/NIDN/Admin)</label>
            <input v-model="form.id" type="text" required class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input v-model="form.password" type="password" required class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50">
          {{ isLoading ? 'Memverifikasi...' : 'Masuk Sekarang' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// Matikan layout bawaan agar halaman login bersih 
definePageMeta({ layout: false })

const form = ref({ id: '', password: '' })
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    
    // Refresh browser & paksa masuk ke Dashboard
    window.location.href = '/' 
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || 'Koneksi ke server gagal.'
  } finally {
    isLoading.value = false
  }
}
</script>