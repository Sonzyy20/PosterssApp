// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:true,
  buildDir: 'dist',
  compatibilityDate: '2024-04-03',
  nitro: {
    preset: 'firebase', // Настройка для развертывания на Firebase
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    
    prefix: 'Ui',
    
    componentDir: './components/ui'
  }
})
