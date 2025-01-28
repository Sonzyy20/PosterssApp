<script setup lang="ts">
// import {PostTredsCards} from '#components';
import { account, ID } from '../lib/appwrite';
import { UseAuthStore } from '~/store/authStore';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';


const {logout} = useLogoutLogic()



const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const AStore = UseAuthStore();
onMounted(async() => {
  const loggedPerson = await account.get()
  
  if(loggedPerson){
    AStore.set({
      email: loggedPerson.email,
      name: loggedPerson.name,
      status: loggedPerson.status,
      id: loggedPerson.$id
    })
    
  }
})


const handleLogout = () => {
  logout()
}

// const checkTheSession = await account.get()
// console.log(checkTheSession)

// console.log(AStore.isAuth)

const redirectToPosts = async () => {
  await navigateTo('/createPost')
  console.log("welcome")}

  const backToMain = async () => {
    await navigateTo("/")
  }

</script>


<template>
  <div class="w-full">

    <div class="flex items-center justify-between w-full mt-2 mb-5">
      <div class="">
        <UiButton type="button" variant="destructive" class="btn-left mr-3 ml-5 px-4 py-2 cursor-pointer"  @click="handleLogout">
          Logout
        </UiButton>
        <UiButton  type="button" @click="backToMain" class="btn-right bg-slate-50 text-black px-4 py-4 w-24 border-solid border-2 p-2 border-black hover:bg-slate-900 hover:text-white hover:cursor-pointer">Posts</UiButton>
      </div>
      
      
      
      
      <div class="">
        <UiInput class="w-[600px] max-w-sm px-4 py-2 border rounded-lg placeholder:text-center" placeholder="Searching"></UiInput>
      </div>
      <div class="mr-5">

        <div class="flex  ml-0">
          
          <UiButton  type="button" @click="redirectToPosts" class="btn-right text-black px-4 py-4 w-24 border-solid border-2 p-2 border-black mr-3 bg-slate-50 hover:bg-slate-900 hover:text-white hover:cursor-pointer">Create Post</UiButton>
          <ProfileMenu/>
 
          
        </div>
      </div>
    </div>
    <slot/>
  </div>
  </template>d