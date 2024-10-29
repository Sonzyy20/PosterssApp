<script lang="ts" setup>
import {PostTredsCards} from '#components';
import { account, ID } from '../lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';


const posts = ref([])
const users = ref([])

onMounted(async() =>{
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/")
  const data = await response.json()
  posts.value = data
//   const results = await fetch(`https://jsonplaceholder.typicode.com/users/`)
// const data2 = await results.json()
//   users.value = data2
})


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)


const router = useRouter(); 
const AStore = UseAuthStore();

const name = AStore.myName
console.log(AStore.isAuth)
const logout = async () => {
  await account.deleteSession('current');
  // loggedInUser.value = null;

  await router.push('/login')
};

// if(!AStore.isAuth){
//    navigateTo ("/login")
//    console.log(AStore.isAuth)
// }


console.log(name)
</script>

<template>
  <div class="flex items-center justify-between w-full mt-2 mb-5">

    <UiButton type="button" variant="destructive" class="btn-left ml-5 px-4 py-2"  @click="logout">
        Logout
      </UiButton>

      <div class="flex-grow"></div>

    <div class="flex-grow">
      <UiInput class="w-full max-w-sm px-4 py-2 border rounded-lg" placeholder="Searching"></UiInput>
    </div>
     

    
    <div class="flex mr-8 ml-0">
        <UiButton variant="primary" class="btn-right text-black px-4 py-4 w-24 border-solid border-2 p-2 border-black mr-3">Create Post</UiButton>

        <UiButton variant="primary" class="btn-right text-black px-4 py-4 w-24 border-solid border-2 p-2 border-black">Hello: {{ AStore.myName }}</UiButton>
      </div>
    </div>
  
    <div class="main_container flext justify-center">
      <div class="cards flex flex-col flex-di items-center ">

        <PostTredsCards v-for="post in posts" :key="post.id" :post="post"></PostTredsCards>
      </div>
    </div>
  
</template>

<style scoped>
.custom_button{
  cursor: pointer;
}
</style>