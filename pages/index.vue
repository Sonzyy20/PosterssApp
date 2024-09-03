<script lang="ts" setup>
import { ref } from 'vue';
import { account, ID } from '../lib/appwrite';

const router = useRouter(); 


const logout = async () => {
  await account.deleteSession('current');
  // loggedInUser.value = null;

  await router.push('/login')
};
</script>

<template>
    <div>
        <UiInput placeholder="Searching"></UiInput>
    </div>
    <UiButton type="button" variant="destructive"  @click="logout">
        Logout
      </UiButton>
</template>