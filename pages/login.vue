<script setup>
import { ref } from 'vue';
import { account, ID } from '../lib/appwrite';
import { UseAuthStore } from '~/store/authStore';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';

definePageMeta({
  layout: false
});

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)



const router = useRouter();
const loggedInUser = ref(null);
const email = ref('');
const password = ref(''); 
const name = ref('');
const usernmae = ref('');
const statusChecker = ref(null);

const AStore = UseAuthStore();

const login = async (email, password) => {
  console.log("1")
  let promise
  let statusChecker
  try{

    promise = await account.createEmailPasswordSession(email, password);
    statusChecker = await account.get();
    const result = await account.getSession('current')
    console.log(result)
    // console.log(statusChecker)
    // console.log(statusChecker.$id)
    // console.log("sucsess")
    // console.log(promise)

  if(statusChecker){
    AStore.set({
      email: statusChecker.email,
      name: statusChecker.name,
      status: statusChecker.status,
      id: statusChecker.$id
    })
  }
  console.log(statusChecker.status);
  console.log(AStore.isAuth)
  await router.push('/')
  }catch (error){
    console.log(error)
    window.alert("Wrong email or password", error)
  }
  
console.log(login.error)
  
};

const register = async () => {
  await account.create(ID.unique(), email.value, password.value, name.value);
  login(email.value, password.value);
};

const logout = async () => {
  await account.deleteSession('current');
  loggedInUser.value = null;
};
</script>

<template>
  <div class="w-full h-[500px] flex justify-center items-center flex-col">
    <p>
      {{ loggedInUser ? `Logged in as ${AStore.myName}` : 'Not logged in' }}
    </p>

    <form class="w-[50%]">
      <div class="fields mb-3">

        <UiInput class="w-[100%] mb-5" type="email" placeholder="Email" v-model="email" />
        <UiInput class="w-[100%] mb-5" type="password" placeholder="Password" v-model="password" />
        <UiInput class="w-[100%] " type="text" placeholder="Name" v-model="name" />
        <p class="text-red-400" v-if="login.error">wrong password bitch</p>
      </div>
      <div class="buttons flex w-full justify-between">

        <UiButton class="mr-3"  type="button" @click="login(email, password)">Login</UiButton>
        <UiButton  class="mr-3" type="button" @touchstart="register" @click="register">
          Register
        </UiButton>
        <UiButton  v-if="!loggedInUser" variant="disabled" class="line-through"  @click="logout">
          Logout
        </UiButton>
        <UiButton type="button" v-else variant="destructive"  @click="logout">
          Logout
        </UiButton>
      </div>
    </form>
  </div>
</template>
