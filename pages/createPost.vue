<script lang="ts" setup>
import { account, ID, database } from '~/lib/appwrite';
import { ref } from 'vue';
import { UseAuthStore } from '~/store/autchSotre';

const Astore = UseAuthStore()

const title = ref('')
const content = ref('')

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
                createdAt: new Date().toISOString()
            }
        );
        alert("Post was created")
        title.value=""
        content.value=""
    }catch(error){
        console.error("resson of error", error)
    }
}
</script>
<template>
    <div class="w-full flex flex-col items-center justify-center">
        <form @submit.prevent="createPost">
            <input v-model="title" type="text" required placeholder="Head of post"/>
            <UiTextarea v-model="content" placeholder="Lef your comment here"></UiTextarea>
            <UiButton class="hover:cursor-pointer" type="button" @click="createPost">Create Post</UiButton>
        </form>
    </div>
</template>


<style lang="scss" scoped>


</style>