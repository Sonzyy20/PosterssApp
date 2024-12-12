<script lang="ts" setup>
import { ref } from 'vue'
const posts = ref<any>([])

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});



</script>

<template>
  <div class="border border-gray-500 rounded p-1 mb-2">
    <p>{{ comment.content }}</p>
    <div class="line w-full border border-black "></div>
    <p>{{ comment.userName }}</p>
    
  </div>
</template>
<style>

</style>