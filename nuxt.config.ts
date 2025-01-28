// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:true,
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    
    prefix: 'Ui',
    
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      DB_ID: process.env.NUXT_DB_ID,
      COLLECTION_POSTS: process.env.NUXT_COLLECTION_POSTS,
      COLLECTION_COMMENTS: process.env.NUXT_COLLECTION_COMMENTS
    }
  }
})
