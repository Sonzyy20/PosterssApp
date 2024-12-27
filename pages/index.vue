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

import { COLLECTION_COMMENTS, COLLECTION_POSTS, DB_ID } from '~/lib/app.constants';
import { navigateTo, useRouter } from 'nuxt/app';


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
  // console.log(JSON.stringify(data))
  posts.value = data.documents;
  console.log(posts.value)

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
      
      window.alert('You are not logged in');
      navigateTo("/login");
      console.log("AStore.isAuth:", AStore.isAuth);
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
    console.log(response);
    documentData.value = response.payload as object
    // console.log(response.payload.title)
    const isCreateEvent = response.events.some(event => event.includes('.create'));
    const isDeleteEvent = response.events.some(event => event.includes('.delete'));
    const isUpdateEvent = response.events.some(event => event.includes('.update'));
    const filterAdd = (post: object) => {
      if (!posts.value.some(existingPost => existingPost.$id === post.$id)) {
        posts.value.push(post);
        console.log("post added")
      }
    };

    if (isCreateEvent) {
        console.log('Документ был добавлен:', response.payload);
    } else if (isDeleteEvent) {
        console.log('Документ был удален:', response.payload);
    } else if (isUpdateEvent) {
        console.log('Документ был обновлен:', response.payload);
    } else {
        console.log('Неизвестное событие:', response.events);
    }
    if(isCreateEvent){
      filterAdd(documentData.value)
    }
// console.log(documentData.value.title)

});
});





  const filterRemove = (postId: string) => {
    posts.value = posts.value.filter(post => post.$id !== postId);
    console.log("post deleted")

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