<script lang="ts" setup>
import { account, ID } from '../lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';



const pinia = createPinia()
const app = createApp(App)
app.use(pinia)


const router = useRouter(); 
const AStore = UseAuthStore();

const name = AStore.myName
console.log(AStore.isAuth)
const logout = async () => {
  await account.deleteSession('current');
  // loggedInUser.value = null;

  await router.push('/login')
};

if(!AStore.isAuth){
   navigateTo ("/login")
   console.log(AStore.isAuth)
}

console.log(name)
</script>

<template>
  <div class="top flex justify-between w-full mt-2">
    <UiButton type="button" variant="destructive" class="ml-5"  @click="logout">
        Logout
      </UiButton>

    <div class="flex  justify-center">
      <UiInput class="w-96" placeholder="Searching"></UiInput>
    </div>
      <div class="profie flex justify-center items-center mr-16">

        <UiButton variant="primary" class="custom_button border-solid border-2 p-2 border-black rounded-full items-center">Hello: {{ AStore.myName }}</UiButton>
      </div>
    </div>
  
</template>

<style scoped>
.custom_button{
  cursor: pointer;
}
</style>