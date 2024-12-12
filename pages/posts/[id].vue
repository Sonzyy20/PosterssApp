<script setup lang="ts">
import { useRoute } from '#app'; 
import { onMounted } from 'vue';
import { database } from '../../lib/appwrite';  
import { Query } from 'appwrite';
import { ref } from 'vue'     
import { client } from '../../lib/appwrite';
import { DB_ID, COLLECTION_COMMENTS } from '~/lib/app.constants';
import CommentsCard from '~/components/CommentsCard.vue';
import { UseAuthStore } from '~/store/autchSotre';

const commentContent = ref('');
const posts = ref<any>([]);
const post = ref(null);
const comments = ref<any>([])
const route = useRoute()
const postId = route.params.id;
const Astore = UseAuthStore();
const documentData = ref<null | object>(null)


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

const leftComment = async() => {
  try{
    const postComId = postId.toString()
   const com = await database.createDocument(
  DB_ID,
  COLLECTION_COMMENTS,
  "unique()",
  {
   userId: Astore.userId,
   postId:  postId,
   createdAt: new Date().toISOString(),
   userName: Astore.myName,
   content: commentContent.value
  }
);
commentContent.value=""
  }catch(error){
    console.log(error)

  }
};






const fetchComments = async () => {
try{
  const result = await database.listDocuments(
    DB_ID,
    COLLECTION_COMMENTS,
    [
      Query.equal("postId", `${postId}`)
    ]
  );
  const postComId = postId.toString()
  const data = await result
  comments.value = data.documents
  console.log(postId)
  console.log(postId as string)
  console.log("comment fetched")
  console.log(comments.value)
  

}catch(error)
{
 console.log(error)
}
}


onMounted(async () => {
  await fethPosts();
  await fetchComments();
});
onMounted(() => {
  
  client.subscribe([`databases.${DB_ID}.collections.${COLLECTION_COMMENTS}.documents`, 'files'], response => {
    // Callback will be executed on changes for documents A and all files.
    console.log(response);
    documentData.value = response.payload as object
    // console.log(response.payload.title)
    const isCreateEvent = response.events.some(event => event.includes('.create'));
    const isDeleteEvent = response.events.some(event => event.includes('.delete'));
    const isUpdateEvent = response.events.some(event => event.includes('.update'));
    const filterAdd = (comment: object) => {
      if (!comments.value.some(existingComment => existingComment.$id === postId)) {
        comments.value.push(comment);
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


</script>
<template>
    <div>
      <div class="wrapper w-full flex justify-between flex-col" v-if="post">
        <div class="flex justify-center flex-col w-full items-center" >
          <div class="Top w-[80%] flex items-center justify-between mb-1">
            <h4 class="absolute text-gray-400">{{ post.userName }}</h4>
            <div class="flex-1 text-center uppercase font-extrabold">{{ post.title }}</div>
          </div>
          <div class="border border-gray-300 w-[80%] h-[1px]"></div>
          <div class="mt-4  mainContent w-[80%]">
            <div>{{ post.content }}</div>
          </div>
              <div class="grid w-[80%] gap-2 mt-5 mb-7">
                <UiTextarea v-model="commentContent" placeholder="Type your message here." />
                <UiButton type="button" @click="leftComment"  >Send message</UiButton>
                <div class="border border-gray-400 mt-10"   ></div>
              </div>
            <CommentsCard v-for="comment in comments" :key="comment.$id" :comment="comment"/>
        </div>
      </div>
    </div>
</template>


<style scoped>

</style>