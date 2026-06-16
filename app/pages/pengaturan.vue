<template>
  <div class="max-w-2xl mx-auto pb-12">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Pengaturan Keamanan</h1>
      <p class="text-sm text-gray-500 mt-1">Perbarui kata sandi akun Anda untuk mencegah akses tidak sah.</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <form @submit.prevent="handleChangePassword" class="space-y-5">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Lama</label>
          <input 
            v-model="form.password_lama" 
            type="password" 
            placeholder="••••••••" 
            class="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            required
          >
        </div>

        <hr class="border-gray-100 my-2">

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
          <input 
            v-model="form.password_baru" 
            type="password" 
            placeholder="Minimal 6 karakter" 
            class="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            required
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
          <input 
            v-model="form.konfirmasi_password" 
            type="password" 
            placeholder="Ulangi kata sandi baru" 
            class="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            required
          >
        </div>

        <div 
          v-if="status.show" 
          :class="status.isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'" 
          class="p-4 rounded-xl text-sm font-medium border flex items-center gap-2"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ status.message }}
        </div>

        <div class="pt-4 flex justify-end">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {{ isSubmitting ? 'Memproses...' : 'Perbarui Kata Sandi' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSubmitting = ref(false)
const form = ref({ password_lama: '', password_baru: '', konfirmasi_password: '' })
const status = ref({ show: false, isError: false, message: '' })

const handleChangePassword = async () => {
  status.value.show = false

  // Validasi kecocokan input password baru
  if (form.value.password_baru !== form.value.konfirmasi_password) {
    status.value = { show: true, isError: true, message: 'Konfirmasi kata sandi baru tidak cocok!' }
    return
  }

  isSubmitting.value = true
  try {
    const res: any = await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        password_lama: form.value.password_lama,
        password_baru: form.value.password_baru
      }
    })

    status.value = { show: true, isError: false, message: res.message }
    // Reset form field
    form.value = { password_lama: '', password_baru: '', konfirmasi_password: '' }
  } catch (error: any) {
    status.value = { 
      show: true, 
      isError: true, 
      message: error.data?.statusMessage || 'Gagal mengubah kata sandi.' 
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>