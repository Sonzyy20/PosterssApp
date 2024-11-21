<script lang="ts" setup>
import { account, ID, database } from '~/lib/appwrite';
import { ref } from 'vue';
import { UseAuthStore } from '~/store/autchSotre';

const Astore = UseAuthStore()

const title = ref('')
const content = ref('')
const textareaHeight = ref('auto');




const createPost = async () => {
    try{
        const post = await database.createDocument(
            '6728f84b000008442afe',
            '6728f8580020cd8ac5b8',
            'unique()',
            {
                title: title.value,
                content: content.value,
                userId: Astore.userId,
                createdAt: new Date().toISOString(),
                userName:   Astore.myName
            }
        );
        alert("Post was created")
        title.value=""
        content.value=""
    }catch(error){
        console.error("resson of error: ", error)
    }
}


onMounted(() => {
  const textarea = document.getElementById('shadcn-textarea') as HTMLTextAreaElement | null;

  if (textarea) {
    // Обработчик события input
    textarea.addEventListener('input', () => {
      // Сбрасываем высоту на auto, чтобы получить scrollHeight
      textarea.style.height = 'auto';
      // Устанавливаем высоту на основе scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }
});
</script>


<template>
    <div class="w-full flex flex-col items-center justify-center">
        <form class="w-full flex flex-col items-center" @submit.prevent="createPost">
            <input class="border border-gray-500 rounded w-1/2 mb-5 p-2" v-model="title" type="text" required placeholder="Head of post"/>
            <UiTextarea id="shadcn-textarea" class="resize-none overflow-hidden w-1/2 broder min-h-[30px] border-gray-500 rounded  mb-4" v-model="content"  :style="{ height: textareaHeight }" placeholder="Lef your comment here"></UiTextarea>
            <UiButton class="hover:cursor-pointer w-1/2 h-[40px]" type="button" @click="createPost">Create Post</UiButton>
        </form>
        
    </div>
</template>


<style lang="scss" scoped>


</style>