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
    build: {
      rollupOptions: {
        output: {
          // Memaksa penamaan file menjadi lebih panjang: chunk-[hash].js
          chunkFileNames: '_nuxt/chunk-[hash].js',
          entryFileNames: '_nuxt/entry-[hash].js',
        }
      }
    }
  },

  sourcemap: false,
  nitro: {
    preset: 'cloudflare-pages'
  }
  })