
<script lang="ts" setup>
// import { UiButton } from '~/components/ui/button/Button.vue';
import { User } from 'lucide-vue-next';
import { COLLECTION_POSTS, DB_ID, COLLECTION_COMMENTS } from '~/lib/app.constants';
import { account, database } from '~/lib/appwrite';
import { UseAuthStore } from '~/store/authStore';
import { vue } from 'vue'
import { useRouter } from '#app';

const commentContent = ref('')
const isDialogOpen = ref(false);
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['postWasDeleted']);


const Astore = UseAuthStore()

const router = useRouter()

function directToPostDetails() {
  router.push(`/posts/${props.post.$id}`)
}

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
  if(!commentContent.value.trim()){
    alert("you dont put any text to your comment")
    return
  }
  try{
   const com = await database.createDocument(
  DB_ID,
  COLLECTION_COMMENTS,
  "unique()",
  {
   userId: Astore.userId,
   postId: props.post.$id,
   createdAt: new Date().toISOString(),
   userName: Astore.myName,
   content: commentContent.value
  }
);
isDialogOpen.value = false
commentContent.value=""
  }catch(error){
    console.log(error)

  }
}


</script>

<template>
  <div class="PostCards border  rounded-xl border-black w-full text-center mb-2 py-2 px-2" @click="directToPostDetails">
    <div class="flex flex-col  items-center" v-if="post">
      <div class="title w-full flex items-center justify-between mb-1">
        <h4 class="text-2xl font-bold mb-1 flex-grow">{{ post.title }} </h4>
        <UiButton variant="destructive" class="cursor-pointer pd-[1px] pr-[2px] pl-[2px]" @click.stop="deletePosts(props.post.$id)" v-if="idCheck()"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</UiButton>
      </div>
      <div class="min-w-[700px] border border-gray-200"></div>
      <h1>{{ post.content }}</h1>
      <div class="buttons flex gap-[9px]">

        <div>
          <UiDialog v-model:open="isDialogOpen">
            <UiDialogTrigger as-child>
              <UiButton variant="outline" @click.stop="isDialogOpen = true">
                left comment
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
                  <UiTextarea class="col-span-3 resize-none" v-model="commentContent"/>
                </div>
              </div>
              <UiDialogFooter>
                <UiButton type="button" @click="leftComment">
                  Add Comment
                </UiButton>
              </UiDialogFooter>
            </UiDialogContent>
          </UiDialog>
        </div>
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