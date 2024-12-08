<script setup lang="ts">
import { useRoute } from '#app'; 
import { onMounted } from 'vue';
import { database } from '../../lib/appwrite';       

const posts = ref<any>([]);
const post = ref(null);
const route = useRoute()
const postId = route.params.id;
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

  post.value = posts.value.find((p)=> p.$id === postId)
}catch(error){
  console.log("Problem: ", error)
}};

onMounted(async () => {
  await fethPosts();
});

</script>
<template>
    <div>
      <div class="wrapper w-full flex justify-between" v-if="post">
        <div class="flex justify-center flex-col w-full items-center" >
          <div class="Top w-[80%] flex items-center justify-between mb-1">
            <h4 class="absolute text-gray-400">{{ post.userName }}</h4>
            <div class="flex-1 text-center uppercase font-extrabold">{{ post.title }}</div>
          </div>
          <div class="border border-gray-300 w-[80%] h-[1px]"></div>
          <div class="mt-4  mainContent w-[80%]">
            <div>{{ post.content }}</div>
          </div>
        </div>
      </div>
        <div v-else>
            <p>пост не найден</p>
        </div>
    </div>
</template>


<style scoped>

</style>