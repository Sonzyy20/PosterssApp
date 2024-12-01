// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:true,
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    
    prefix: 'Ui',
    
    componentDir: './components/ui'
  }
})
