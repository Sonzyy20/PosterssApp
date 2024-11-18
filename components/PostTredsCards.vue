
<script lang="ts" setup>
import { User } from 'lucide-vue-next';
import { COLLECTION_POSTS, DB_ID } from '~/lib/app.constants';
import { account, database } from '~/lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['postWasDeleted']);

// console.log(props.post.userId)
const Astore = UseAuthStore()

// const idCeck = () :boolean => {
//   if(props.post.userId == Astore.userId){
//     // console.log('true')
//     return true
//   }else{
//     // console.log('false')
//     return false
//   }
// }

const idCheck = () => {
  return props.post.userId === Astore.userId
}
  




const deletePosts = async (postId: string) => {
  try{
    await database.deleteDocument(
  DB_ID,
  COLLECTION_POSTS,
  postId
)
emit('postWasDeleted', props.post.$id)
  }catch(error){
    console.log(error)
  }
}


</script>

<template>
  <div class="PostCards border  rounded-xl border-black w-full text-center mb-2 py-2 px-2">
    <div class="flex flex-col  items-center" v-if="post">
      <h4 class="text-2xl font-bold mb-1">{{ post.title }} </h4>
      <div class="min-w-[700px] border border-gray-200"></div>
      <h1>{{ post.content }}</h1>
      <UiButton  class="cursor-pointer" @click="deletePosts(props.post.$id)" v-if="idCheck()">Delete Post</UiButton>
      
      <div class="w-full flex justify-end">
        <p class="text-slate-400">Author:</p>
        <p class="text-slate-800">{{ `  ${post.userName}` }}</p>
      </div>
    </div>
    
  </div>
</template>

<style>

</style>