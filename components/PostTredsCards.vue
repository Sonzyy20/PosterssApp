
<script lang="ts" setup>
import { User } from 'lucide-vue-next';
import { COLLECTION_COMMENTS, COLLECTION_POSTS, DB_ID } from '~/lib/app.constants';
import { account, database } from '~/lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['postWasDeleted']);


const Astore = UseAuthStore()


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


const leftComment = async (postId: string) => {
  try{
    await database.createDocument(
  DB_ID,
  COLLECTION_COMMENTS,
  "unique()",
  {
   userId: Astore.userId,
   postId: postId,
   createdAt: new Date().toISOString(),
   userName: Astore.myName,

    
    
  }
)
  }catch{

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
      <div>
        <UiDialog>
    <UiDialogTrigger as-child>
      <UiButton variant="outline">
        Edit Profile
      </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="sm:min-w-[600px]">
      <UiDialogHeader>
        <UiDialogTitle>Left Your Comment</UiDialogTitle>
      </UiDialogHeader>
      <div class="grid gap-4 py-4">      
        <div class="grid grid-cols-4 items-center gap-4">
          <UiLabel for="username" class="text-right">
            Comment text
          </UiLabel>
          <UiTextarea class="col-span-3 resize-none"/>
        </div>
      </div>
      <UiDialogFooter>
        <Button type="submit">
          Save changes
        </Button>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
      </div>
      
      <div class="w-full flex justify-end">
        <p class="text-slate-400">Author:</p>
        <p class="text-slate-800">{{ `  ${post.userName}` }}</p>
      </div>
    </div>
    
  </div>
</template>

<style>

</style>