<script setup>
import { ref } from 'vue';
import { account, ID } from '../lib/appwrite';
const router = useRouter();
const loggedInUser = ref(null);
const email = ref('');
const password = ref('');
const name = ref('');


const login = async (email, password) => {
  await account.createEmailPasswordSession(email, password);
  loggedInUser.value = await account.get();
  console.log(loggedInUser)
 
  console.log(loggedInUser.status)
  await router.push('/')
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
      {{ loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in' }}
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
