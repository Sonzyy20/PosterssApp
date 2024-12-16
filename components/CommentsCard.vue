<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const posts = ref<any>([])

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});
const calculateDiffDays = () :string => {

  const endTime = props.comment.createdAt
  
  const currentTime = new Date()
  const diffTime = Date.parse(currentTime) - Date.parse(endTime)
  const diffInDays = Math.round(diffTime/(1000 * 3600 * 24))
  const diffInHours = (diffTime/(1000 * 3600))
  const diffInMinutes = Math.round(diffTime/(1000 * 60))
  if(diffInHours<1){
    
  return `${diffInMinutes} minutes`
  }

  else if(diffInDays <= 0){
    console.log(diffInHours)
    return `${diffInHours} hours ago`
  }else{
    console.log(diffInDays)
    return `${diffInDays} days Ago`
  }



}


</script>

<template>
  <div class="border border-gray-500 rounded p-1 mb-2 w-[80%]  ">

      <p>{{ comment.content }}  </p>
    
    <div class="line w-full border border-black "></div>
    <div class="flex gap-2">

      <p>{{ comment.userName }} </p>
      <p class="text-gray-400"  >{{ calculateDiffDays() }}</p>
    </div>
    
  </div>
</template>
<style>

</style>