// server/api/courses.get.ts

export default defineEventHandler(async (event) => {
  // Gunakan optional chaining (?.) atau ts-ignore jika typescript masih rewel
  // saat development lokal
  const env = event.context.cloudflare?.env
  
  // Jika env belum siap (saat dev lokal tanpa wrangler proxy), beri fallback
  if (!env || !env.DB) {
    return {
      status: 'error',
      message: 'Database D1 belum terhubung di environment ini.'
    }
  }

  const db = env.DB
  
  return {
    status: 'success',
    source: 'Cloudflare Pages Function + D1',
    data: [
      { id: '02SIFP010', nama: 'Sistem Operasi', dosen: 'Salman Farizy' }
    ]
  }
})