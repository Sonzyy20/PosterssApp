<script lang="ts" setup>

const props = defineProps({
    post:{

        type: Object,
        required: true
    }
})



</script>

<template>
  <div>
    <h4>{{ post.title }}</h4>
    <h1>{{ post.body }}</h1>
  </div>
</template>

<style>

</style>