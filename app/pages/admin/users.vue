<template>
  <div class="max-w-7xl mx-auto pb-12">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Manajemen Pengguna</h1>
        <p class="text-sm text-gray-500 mt-1">Panel Pusat Akademik - Kelola Akun & Import Massal</p>
      </div>
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Kembali ke Dashboard
      </NuxtLink>
    </div>

    <div class="mb-8 bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-lg font-bold">Import Data Massal (.CSV)</h2>
          <p class="text-blue-100 text-sm mt-1 max-w-2xl">
            Unggah file CSV dengan format kolom: <code class="bg-blue-800 px-1.5 py-0.5 rounded text-xs font-mono font-bold">id, nama, email, role, password</code>.
            Sistem mendeteksi data secara otomatis hingga 2.000 baris secara berkala via UI.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <input type="file" ref="fileInput" accept=".csv" class="hidden" @change="handleCSVUpload">
          <button @click="$refs.fileInput.click()" class="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition-transform active:scale-95">
            Pilih File CSV
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            Tambah Pengguna Manual
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
              <input v-model="form.id" type="text" placeholder="Masukkan Nomor Induk" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input v-model="form.nama" type="text" placeholder="Nama lengkap tanpa gelar" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Resmi</label>
              <input v-model="form.email" type="email" placeholder="contoh@unpam.ac.id" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
            </div>

            <div v-if="notif.show" :class="notif.isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'" class="p-3 rounded-lg text-sm font-medium border flex items-start gap-2">
              {{ notif.message }}
            </div>

            <button type="submit" :disabled="isSubmitting" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna' }}
            </button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-xl border">
          <button 
            v-for="tab in ['semua', 'mahasiswa', 'dosen', 'admin']" 
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-3 text-sm font-bold border-b-2 capitalize transition-all"
            :class="activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            {{ tab }}
            <span class="ml-1 text-xs px-2 py-0.5 bg-gray-100 rounded-full font-normal text-gray-500">
              {{ countUsersByRole(tab) }}
            </span>
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4 font-semibold">Identitas</th>
                  <th class="px-6 py-4 font-semibold">Kontak</th>
                  <th class="px-6 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="pending" class="bg-white">
                  <td colspan="3" class="px-6 py-8 text-center text-gray-500 animate-pulse">Memuat data direktori...</td>
                </tr>
                <tr v-else-if="filteredUsers.length === 0" class="bg-white">
                  <td colspan="3" class="px-6 py-8 text-center text-gray-400">Tidak ada pengguna pada kategori ini.</td>
                </tr>
                <tr v-else v-for="user in filteredUsers" :key="user.id" class="hover:bg-blue-50/30 transition-colors bg-white">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900 text-base uppercase">{{ user.nama }}</p>
                    <p class="text-xs font-mono text-gray-500 mt-0.5">{{ user.id }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-gray-800">{{ user.email }}</p>
                    <span 
                      class="inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded mt-1"
                      :class="user.role === 'mahasiswa' ? 'bg-blue-100 text-blue-700' : (user.role === 'dosen' ? 'bg-purple-100 text-purple-700' : 'bg-gray-800 text-white')"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button @click="openEditModal(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ubah Data">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button @click="deleteUser(user.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Akun">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 006 0V4m-6 0h6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editModal.isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Ubah Data Pengguna</h3>
        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID (Tidak dapat diubah)</label>
            <input v-model="editModal.form.id" type="text" disabled class="w-full text-sm bg-gray-50 border border-gray-200 text-gray-400 rounded-lg p-2.5 cursor-not-allowed font-mono">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input v-model="editModal.form.nama" type="text" required class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Resmi</label>
            <input v-model="editModal.form.email" type="email" required class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Peran (Role)</label>
            <select v-model="editModal.form.role" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sandi Baru (Kosongkan jika tidak diubah)</label>
            <input v-model="editModal.form.password" type="password" placeholder="••••••••" class="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" @click="editModal.isOpen = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">Batal</button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
const { data: response, pending, refresh: refreshData } = await useFetch('/api/admin/users')
const daftarUser = computed(() => response.value?.data || [])

// Filter Kategori Tab
const activeTab = ref('semua')
const filteredUsers = computed(() => {
  if (activeTab.value === 'semua') return daftarUser.value
  return daftarUser.value.filter(u => u.role === activeTab.value)
})

// Fungsi Menghitung Total User di Tiap Kategori Tab
const countUsersByRole = (role) => {
  if (role === 'semua') return daftarUser.value.length
  return daftarUser.value.filter(u => u.role === role).length
}

// State Form Tambah Manual
const isSubmitting = ref(false)
const form = ref({ id: '', nama: '', email: '', role: 'mahasiswa' })
const notif = ref({ show: false, isError: false, message: '' })

const submitUser = async () => {
  isSubmitting.value = true
  try {
    const res = await $fetch('/api/admin/users', { method: 'POST', body: form.value })
    notif.value = { show: true, isError: false, message: res.message }
    form.value = { id: '', nama: '', email: '', role: 'mahasiswa' }
    await refreshData()
  } catch (error) {
    notif.value = { show: true, isError: true, message: error.data?.statusMessage || 'Gagal menyimpan.' }
  } finally {
    isSubmitting.value = false
    setTimeout(() => { notif.value.show = false }, 5000)
  }
}

// State Modal Edit Data
const editModal = ref({
  isOpen: false,
  form: { id: '', nama: '', email: '', role: '', password: '' }
})

const openEditModal = (user) => {
  editModal.value.form = { ...user, password: '' }
  editModal.value.isOpen = true
}

const submitEdit = async () => {
  try {
    await $fetch(`/api/admin/users/${editModal.value.form.id}`, {
      method: 'PUT',
      body: editModal.value.form
    })
    editModal.value.isOpen = false
    await refreshData()
  } catch (error) {
    alert('Gagal mengupdate data pengguna')
  }
}

// Fungsi Hapus User dari DB D1
const deleteUser = async (userId) => {
  if (confirm('Apakah Anda yakin ingin menghapus akun ini secara permanen? Semua history kuis dan nilai terkait akan ikut terhapus.')) {
    try {
      await $fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      await refreshData()
    } catch (error) {
      alert('Gagal menghapus pengguna.')
    }
  }
}

// PENGEMBANGAN LANJUTAN: Client-side CSV Parser
const handleCSVUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const text = e.target.result
    const lines = text.split('\n').map(line => line.split(','))
    
    // Baris pertama (index 0) biasanya adalah header kolom: id, nama, email, role, password
    const dataRows = lines.slice(1).filter(row => row.length >= 4 && row[0].trim() !== '')

    if (dataRows.length > 2000) {
      alert(`Data terlalu besar (${dataRows.length} baris). Untuk data berskala besar (500.000 mahasiswa), mohon gunakan wrangler CLI D1 import via terminal agar tidak memicu memory limit browser.`)
      return
    }

    alert(`Berhasil membaca ${dataRows.length} baris mahasiswa dari CSV. Memulai sinkronisasi bertahap ke Cloudflare D1...`)
    
    // Loop untuk mengirim data ke API POST secara sekuensial
    for (const row of dataRows) {
      try {
        await $fetch('/api/admin/users', {
          method: 'POST',
          body: { id: row[0].trim(), nama: row[1].trim(), email: row[2].trim(), role: row[3].trim().toLowerCase() }
        })
      } catch (err) {
        // Abaikan jika ada baris data yang bentrok/duplikat
      }
    }
    
    alert('Proses Sinkronisasi CSV selesai!')
    await refreshData()
  }
  reader.readAsText(file)
}
</script>