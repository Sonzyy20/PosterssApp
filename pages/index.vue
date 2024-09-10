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
const logout = async () => {
  await account.deleteSession('current');
  // loggedInUser.value = null;

  await router.push('/login')
};

console.log(name)
</script>

<template>
    <div class="flex justify-center mt-2">
        <UiInput class="w-1/2 flex justify-center" placeholder="Searching"></UiInput>
    </div>
    <UiButton type="button" variant="destructive"  @click="logout">
        Logout
      </UiButton>
  
</template>