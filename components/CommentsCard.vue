<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import ContextMenuTrigger from './ui/context-menu/ContextMenuTrigger.vue';
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
  else {
    return `${diffInHours < 24 ? diffInHours : diffInDays} ${diffInHours < 24 ? 'hours' : 'days'}`
  }



}

console.log(props.comment)
</script>

<template>
  <div class=" border-gray-500 rounded p-1 mb-2 w-[80%]  ">
    <div class="flex gap-2">
      <UiContextMenu>
        
        <ContextMenuTrigger>
          <p>{{ comment?.userName }} </p> 
        </ContextMenuTrigger>
        <UiContextMenuContent>
          
          <UiContextMenuItem>Delete Comment</UiContextMenuItem>
          <UiContextMenuItem> {{comment.$id  }}</UiContextMenuItem>
        </UiContextMenuContent>
      </UiContextMenu>
      <p class="text-gray-400"  >{{ calculateDiffDays() }}</p>

    </div>

    <div class="flex items-end w-full h-12 ">     
    
     <div class="relative w-6 h-7 self-center">
        <div class="absolute bottom-0 left-0 w-5 h-10 ml-2 border-l-2 border-b-2 border-gray-500 rounded-bl-[23px]"></div>
      </div>
      <div class="ml-1 text-gray-700">
        <p class=""  >{{ comment?.content }}  </p>
      </div>        
    </div>    
  </div>
  <!-- <div v-else>Here no comments before</div> -->
</template>
<style>

</style>