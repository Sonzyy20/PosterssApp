import { account } from "../lib/appwrite";
import { UseAuthStore } from "~/store/authStore";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "~/app.vue";
const pinia = createPinia()
const app = createApp(App);
app.use(pinia)
const AStore = UseAuthStore();


 
export function useLogoutLogic() {
    const router = useRouter();
  
    const logout = async () => {
      try {
    
        await account.deleteSession('current');
  
       
        await router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
  
    return {
      logout,
    }
}