<script lang="ts" setup>
import {PostTredsCards} from '#components';
import { account, ID, database } from '../lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';

// definePageMeta({
//   layout: false
// })

useSeoMeta({
  title:'posts'
})

const posts = ref([])
// const users = ref([])

onMounted(async() =>{
  const result = await database.listDocuments(
    '6728f84b000008442afe', // databaseId
    '6728f8580020cd8ac5b8', // collectionId
    [] // queries (optional)
);
  const data = await response.json()
  posts.value = data
//   const results = await fetch(`https://jsonplaceholder.typicode.com/users/`)
// const data2 = await results.json()
//   users.value = data2
})


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)


// const router = useRouter(); 
const AStore = UseAuthStore();

// const name = AStore.myName
// console.log(AStore.isAuth)
// const logout = async () => {
//   await account.deleteSession('current');
//   // loggedInUser.value = null;

//   await router.push('/login')
// };

if(!AStore.isAuth){
  if(process.client){
    
    window.alert('you are not loginned');
    navigateTo ("/login")
  }
  
   console.log(AStore.isAuth)
}


// console.log(name)
</script>

<template>
  <div class="flex items-center justify-center  w-full mt-2 mb-5">

   
  
    <div class="main_container flext justify-center">
      <div class="cards flex flex-col flex-di items-center ">
        <p>your id {{ AStore.userId }}</p>
        <PostTredsCards v-for="post in posts" :key="post.id" :post="post"></PostTredsCards>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.custom_button{
  cursor: pointer;
}
</style>