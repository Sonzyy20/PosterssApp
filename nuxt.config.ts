// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
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
