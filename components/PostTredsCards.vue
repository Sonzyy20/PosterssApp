
<script lang="ts" setup>
import axios from 'axios'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})



</script>

<template>
  <div class="PostCards border rounded-xl border-black w-5/6 mb-2 py-2 px-2">
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <h1>{{ post.body }}</h1>
    </div>
    
  </div>
</template>

<style>
.PostCards{
  
}
</style>