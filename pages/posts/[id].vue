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
        <div v-if="post">

            <h1>{{ post.title }}</h1>
            <p>{{ post.content }}</p>
        </div>
        <div v-else>
            <p>пост не найден</p>
        </div>
    </div>
</template>


<style scoped>

</style>