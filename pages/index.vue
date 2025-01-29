<!-- todo: сделать ответ на коментарии. сделать работающий провиль, добавить аватарки -->

<script lang="ts" setup>
import PostTredsCards from '../components/PostTredsCards.vue';
import { account, database, client } from '../lib/appwrite';
import { UseAuthStore } from '~/store/authStore';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { ref } from 'vue'
import App from '~/app.vue';
import { onMounted } from 'vue';
import { navigateTo, useRouter } from 'nuxt/app';

interface Post extends Object{
  $id: string
}

const {DB_ID, COLLECTION_POSTS} = useRuntimeConfig().public;


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const errorThrow = ref();
const AStore = UseAuthStore();
const documentData = ref<null | object>(null);
const router = useRouter()
const posts = ref<any>([])

useSeoMeta({
  title:'posts'
})

const fethPosts = async () => {
try{
  const result = await database.listDocuments(
    '6728f84b000008442afe', // databaseId
    '6728f8580020cd8ac5b8', // collectionId
    [] // queries (optional)
);
  const data = await result;
  
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
 
    errorThrow.value = error;

    if(process.client){
      
      window.alert('You are not logged in');
      navigateTo("/login");
      
  }
console.log("Your problem: ", error)
}};


onMounted(async () => {
  await fethPosts();
  await checkUserAuth();
});

onMounted(() => {
  
  client.subscribe([`databases.${DB_ID}.collections.${COLLECTION_POSTS}.documents`, 'files'], response => {
    // Callback will be executed on changes for documents A and all files.
    
    documentData.value = response.payload as object
    
    const isCreateEvent = response.events.some(event => event.includes('.create'));
    const isDeleteEvent = response.events.some(event => event.includes('.delete'));
    const isUpdateEvent = response.events.some(event => event.includes('.update'));
    const filterAdd = (post: Post) => {
      if (!posts.value.some((existingPost: Post) => existingPost.$id === post.$id)) {
        posts.value.push(post);
        console.log(post)
        
      }
    };
    if(isCreateEvent){
      filterAdd(documentData.value as Post)
    }

});
});





  const filterRemove = (postId: string) => {
    posts.value = posts.value.filter((post: { $id: string; }) => post.$id !== postId);
   

  }
  

</script>

<template>
  <div class="flex items-center justify-center w-full mt-2 mb-5">
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