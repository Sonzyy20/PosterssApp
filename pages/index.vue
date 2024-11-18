<script lang="ts" setup>
import {PostTredsCards} from '#components';
import { account, database } from '../lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const errorThrow = ref();
const AStore = UseAuthStore();

useSeoMeta({
  title:'posts'
})

const posts = ref<any>([])


const fethPosts = async () => {
try{
  const result = await database.listDocuments(
    '6728f84b000008442afe', // databaseId
    '6728f8580020cd8ac5b8', // collectionId
    [] // queries (optional)
);
  const data = await result;
  console.log(JSON.stringify(data))
  posts.value = data.documents;

}catch(error){
  console.log("Problem: ", error)
}};



const checkUserAuth = async () => {
try{
  const loggedPerson = await account.get()
if(loggedPerson){
  AStore.set({
    email: loggedPerson.email,
    name: loggedPerson.name,
    status: loggedPerson.status,
    id: loggedPerson.$id
  })  
}}catch(error){
    console.log("authText")
    errorThrow.value = error;
    if(process.client){
      
      window.alert('you are not loginned');
      navigateTo ("/login")
    
    
    console.log(AStore.isAuth) 
  }
console.log("Your problem: ", error)
}};


onMounted(async () => {
  await fethPosts();
  await checkUserAuth();
})



  const filterRemove = (postId: string) => {
    posts.value = posts.value.filter(post => post.$id !== postId)

  }

</script>

<template>
  <div class="flex items-center justify-center  w-full mt-2 mb-5">
    <div class="main_container flext justify-center">
      <div class="cards flex flex-col flex-di items-center ">
        <PostTredsCards v-for="post in posts" :key="post.$id" :post="post" @postWasDeleted="filterRemove" ></PostTredsCards>
      </div>
      <UiAlert variant="destructive" v-if="errorThrow">
        <UiAlertTitle>{{ errorThrow }}</UiAlertTitle>
      </UiAlert>
    </div>
  </div>
  
</template>

<style scoped>
.custom_button{
  cursor: pointer;
}
</style>