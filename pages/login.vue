<script setup>
import { ref } from 'vue';
import { account, ID } from '../lib/appwrite';
import { UseAuthStore } from '~/store/autchSotre';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/app.vue';


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
    console.log("sucsess")
    console.log(promise)

  if(statusChecker){
    AStore.set({
      email: statusChecker.email,
      name: statusChecker.name,
      status: statusChecker.status,
    })
  }
  console.log(statusChecker.status);
  console.log(AStore.isAuth)
  await router.push('/')
  }catch (error){
    console.log(error)
    console.log("u got error")
  }
  

  
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
  <div>
    <p>
      {{ loggedInUser ? `Logged in as ${AStore.myName}` : 'Not logged in' }}
    </p>

    <form>
      <UiInput class="w-1/2 mb-5" type="email" placeholder="Email" v-model="email" />
      <UiInput class="w-1/2 mb-5" type="password" placeholder="Password" v-model="password" />
      <UiInput class="w-1/2 mb-5" type="text" placeholder="Name" v-model="name" />
      <UiButton class="mr-3" type="button" @click="login(email, password)">Login</UiButton>
      <UiButton class="mr-3" type="button" @click="register">
        Register
      </UiButton>
      <UiButton  v-if="!loggedInUser" variant="disabled" class="line-through"  @click="logout">
        Logout
      </UiButton>
      <UiButton type="button" v-else variant="destructive"  @click="logout">
        Logout
      </UiButton>
    </form>
  </div>
</template>
