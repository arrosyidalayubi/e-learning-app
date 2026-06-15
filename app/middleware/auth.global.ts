export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil data user dari cookie
  const authUser = useCookie('auth_user')

  // 1. Jika belum login dan mencoba masuk ke halaman selain /login
  if (!authUser.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // 2. Jika sudah login tapi mencoba mengakses halaman /login
  if (authUser.value && to.path === '/login') {
    return navigateTo('/') // Lempar kembali ke Dashboard
  }
})