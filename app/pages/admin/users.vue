<template>
  <div class="max-w-7xl mx-auto pb-12">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Manajemen Pengguna</h1>
        <p class="text-sm text-gray-500 mt-1">Panel Admin Akademik - Tambah & Kelola Mahasiswa / Dosen</p>
      </div>
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Dashboard Utama
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            Tambah Pengguna Baru
          </h2>
          
          <form @submit.prevent="submitUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peran (Role)</label>
              <select v-model="form.role" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" required>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ form.role === 'mahasiswa' ? 'NIM' : (form.role === 'dosen' ? 'NIDN' : 'ID Admin') }}
              </label>
              <input v-model="form.id" type="text" placeholder="Contoh: M-202602 atau 251011..." class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input v-model="form.nama" type="text" placeholder="Masukkan nama lengkap" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Kampus</label>
              <input v-model="form.email" type="email" placeholder="contoh@mhs.unpam.ac.id" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>

            <div v-if="notif.show" :class="notif.isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'" class="p-3 rounded-lg text-sm font-medium border flex items-start gap-2">
              <svg v-if="notif.isError" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ notif.message }}
            </div>

            <button type="submit" :disabled="isSubmitting" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna' }}
            </button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">Direktori Pengguna</h2>
            <button @click="refreshData" class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600">
                <tr>
                  <th class="px-6 py-4 font-semibold">ID / NIM</th>
                  <th class="px-6 py-4 font-semibold">Nama Lengkap</th>
                  <th class="px-6 py-4 font-semibold">Role</th>
                  <th class="px-6 py-4 font-semibold">Terdaftar</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="pending" class="bg-white">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500 animate-pulse">Memuat data pengguna...</td>
                </tr>
                <tr v-else-if="daftarUser.length === 0" class="bg-white">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">Belum ada pengguna terdaftar.</td>
                </tr>
                <tr v-else v-for="user in daftarUser" :key="user.id" class="hover:bg-blue-50/50 transition-colors bg-white">
                  <td class="px-6 py-4 font-mono text-gray-600">{{ user.id }}</td>
                  <td class="px-6 py-4 font-bold text-gray-900">
                    {{ user.nama }}
                    <div class="text-xs text-gray-500 font-normal mt-0.5">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-700': user.role === 'mahasiswa',
                        'bg-purple-100 text-purple-700': user.role === 'dosen',
                        'bg-gray-800 text-white': user.role === 'admin'
                      }"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-500 text-xs">
                    {{ new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// 1. Ambil Data User (GET)
const { data: response, pending, refresh: refreshData } = await useFetch('/api/admin/users')
const daftarUser = computed(() => response.value?.data || [])

// 2. State untuk Form Tambah User
const isSubmitting = ref(false)
const form = ref({
  id: '',
  nama: '',
  email: '',
  role: 'mahasiswa'
})

// State untuk Notifikasi Alert
const notif = ref({
  show: false,
  isError: false,
  message: ''
})

// 3. Fungsi Eksekusi Simpan Data (POST)
const submitUser = async () => {
  isSubmitting.value = true
  notif.value.show = false
  
  try {
    const res = await $fetch('/api/admin/users', {
      method: 'POST',
      body: form.value
    })
    
    // Tampilkan notif sukses
    notif.value = { show: true, isError: false, message: res.message }
    
    // Reset Form
    form.value.id = ''
    form.value.nama = ''
    form.value.email = ''
    
    // Segarkan tabel agar data baru langsung muncul
    await refreshData()
    
  } catch (error) {
    // Tangkap error (misal ID sudah ada)
    notif.value = { 
      show: true, 
      isError: true, 
      message: error.data?.statusMessage || 'Terjadi kesalahan sistem.' 
    }
  } finally {
    isSubmitting.value = false
    
    // Sembunyikan notif otomatis setelah 5 detik
    setTimeout(() => { notif.value.show = false }, 5000)
  }
}
</script>