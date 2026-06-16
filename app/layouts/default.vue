<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <span class="text-xl font-bold text-blue-700 flex items-center gap-2">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          MENTARI V2
        </span>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NuxtLink 
          to="/" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="route.path === '/' || route.path.startsWith('/kursus') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          Dashboard
        </NuxtLink>
        
        <NuxtLink 
          to="/jadwal" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="route.path.startsWith('/jadwal') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          Jadwal Kuliah
        </NuxtLink>
        
        <NuxtLink 
          to="/nilai" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="route.path.startsWith('/nilai') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          Transkrip Nilai
        </NuxtLink>

        <NuxtLink 
          to="/pengaturan" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="route.path.startsWith('/pengaturan') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'"
        >
          Keamanan Akun
        </NuxtLink>

        <div v-if="authUser?.role === 'admin'" class="pt-4 mt-4 border-t border-gray-100">
          <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Kontrol</p>
          <NuxtLink 
            to="/admin/users" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
            :class="route.path.startsWith('/admin') ? 'bg-red-50 font-bold' : ''"
          >
            Manajemen Pengguna
          </NuxtLink>
        </div>
      </nav>

      <div class="p-4 border-t border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase shadow-sm">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-900 truncate uppercase">{{ authUser?.nama || 'Guest' }}</p>
            <p class="text-[10px] text-gray-500 font-medium capitalize truncate">{{ authUser?.role }}</p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <button class="md:hidden p-2 text-gray-400 hover:text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        
        <div class="flex-1 flex justify-end items-center gap-4">
          <button class="p-1 rounded-full text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </button>
          
          <span class="text-gray-300">|</span>

          <div class="flex items-center gap-3">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-bold text-gray-900 uppercase truncate max-w-37.5">{{ authUser?.nama }}</p>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{{ authUser?.id }}</p>
            </div>
            
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
              {{ userInitials }}
            </div>

            <button 
              @click="handleLogout"
              class="ml-2 p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Keluar Aplikasi"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// Membaca session cookie user yang terdaftar
const authUser = useCookie('auth_user')

// Fungsi mengekstrak inisial nama secara otomatis (cth: Arrosyid Al -> AA)
const userInitials = computed(() => {
  if (!authUser.value?.nama) return '??'
  const namaParts = authUser.value.nama.trim().split(' ')
  if (namaParts.length > 1) {
    return (namaParts[0][0] + namaParts[1][0]).toUpperCase()
  }
  return namaParts[0][0].toUpperCase()
})

// Fungsi logout membersihkan cookie dan redirect ke halaman login
const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}
</script>