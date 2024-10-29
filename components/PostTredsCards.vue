
<script lang="ts" setup>
import { User } from 'lucide-vue-next';


const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})


const results = await fetch(`https://jsonplaceholder.typicode.com/users/${props.post.userId}`)
const data = await results.json()
const user = data
</script>

<template>
  <div class="PostCards border  rounded-xl border-black w-5/6 text-center mb-2 py-2 px-2">
    <div class="flex flex-col items-center" v-if="post">
      <h4 class="text-2xl font-bold mb-1">{{ post.title }} </h4>
      <div class="min-w-[700px] border border-gray-200"></div>
      <h1>{{ post.body }}</h1>
      <div class="w-full flex justify-end">
        <p class="text-slate-400">Author:</p>
        <p class="text-slate-800">{{ `  ${user.name}` }}</p>
      </div>
    </div>
    
  </div>
</template>

<style>

</style>