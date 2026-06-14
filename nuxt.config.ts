import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Menjamin aplikasi menggunakan fitur standar v4
  compatibilityDate: '2026-06-13',
  future: {
    compatibilityVersion: 4,
  },
  
  // Karena CSS dipindah ke dalam app/
  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Konfigurasi ini sangat optimal untuk deployment Cloudflare Pages nantinya
  nitro: {
    preset: 'cloudflare-pages'
  }
  })